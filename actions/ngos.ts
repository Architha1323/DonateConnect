'use server';

import { prisma } from '@/lib/prisma';
import { ensureDbUser } from './auth';

export async function getNgos(params?: { status?: string; search?: string; location?: string; limit?: number; page?: number }) {
  try {
    const where: any = {};
    if (params?.status && params.status !== 'all') {
      where.verificationStatus = params.status;
    }
    if (params?.search) {
      where.ngoName = { contains: params.search, mode: 'insensitive' };
    }
    if (params?.location) {
      where.OR = [
        { city: { contains: params.location, mode: 'insensitive' } },
        { state: { contains: params.location, mode: 'insensitive' } },
      ];
    }
    const limit = params?.limit || 20;
    const page = params?.page || 1;

    const [ngos, total] = await Promise.all([
      prisma.ngo.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
          _count: { select: { acceptedDonations: true, beneficiaries: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.ngo.count({ where }),
    ]);

    return { ngos, total, totalPages: Math.ceil(total / limit) };
  } catch (error: any) {
    return { error: error.message, ngos: [] };
  }
}

export async function getNgoById(id: string) {
  try {
    const ngo = await prisma.ngo.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        _count: { select: { acceptedDonations: true, beneficiaries: true } },
      },
    });
    return { ngo };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function verifyNgo(ngoId: string, status: 'VERIFIED' | 'REJECTED') {
  const user = await ensureDbUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Not authorized' };

  try {
    const ngo = await prisma.ngo.update({
      where: { id: ngoId },
      data: {
        verificationStatus: status,
        verifiedAt: status === 'VERIFIED' ? new Date() : null,
      },
      include: { user: true },
    });

    await prisma.notification.create({
      data: {
        userId: ngo.userId,
        type: 'NGO_VERIFIED',
        title: status === 'VERIFIED' ? 'NGO Verified!' : 'NGO Verification Rejected',
        message: status === 'VERIFIED'
          ? 'Your NGO has been verified. You can now receive donations.'
          : 'Your NGO verification was rejected. Please contact support.',
        link: '/ngo/dashboard',
      },
    });

    return { success: true, ngo };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getNgoStats() {
  const user = await ensureDbUser();
  if (!user) return null;

  const ngo = await prisma.ngo.findUnique({ where: { userId: user.id } });
  if (!ngo) return null;

  const [pendingDonations, acceptedDonations, completedDonations, totalBeneficiaries] = await Promise.all([
    prisma.donation.count({ where: { status: 'PENDING' } }),
    prisma.donation.count({ where: { ngoId: ngo.id, status: { notIn: ['PENDING', 'COMPLETED', 'CANCELLED'] } } }),
    prisma.donation.count({ where: { ngoId: ngo.id, status: 'COMPLETED' } }),
    prisma.beneficiary.count({ where: { ngoId: ngo.id } }),
  ]);

  const totalItemsDistributed = await prisma.donationItem.aggregate({
    where: { donation: { ngoId: ngo.id, status: { in: ['DISTRIBUTED', 'COMPLETED'] } } },
    _sum: { quantity: true },
  });

  return {
    pendingDonations,
    acceptedDonations,
    completedDonations,
    totalBeneficiaries,
    totalItemsDistributed: totalItemsDistributed._sum.quantity || 0,
  };
}
