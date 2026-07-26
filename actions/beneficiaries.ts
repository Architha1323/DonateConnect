'use server';

import { prisma } from '@/lib/prisma';
import { ensureDbUser } from './auth';

export async function getBeneficiaries(params?: { search?: string; limit?: number }) {
  const user = await ensureDbUser();
  if (!user) return { error: 'Not authenticated', beneficiaries: [] };
  try {
    const where: any = {};
    if (user.role === 'NGO') {
      const ngo = await prisma.ngo.findUnique({ where: { userId: user.id } });
      if (ngo) where.ngoId = ngo.id;
    }
    if (params?.search) {
      where.user = { name: { contains: params.search, mode: 'insensitive' } };
    }
    const beneficiaries = await prisma.beneficiary.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        ngo: { select: { id: true, ngoName: true } },
        _count: { select: { requests: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: params?.limit || 50,
    });
    return { beneficiaries };
  } catch (error: any) {
    return { error: error.message, beneficiaries: [] };
  }
}

export async function createBeneficiaryRequest(data: { category: string; quantity: number; description?: string }) {
  const user = await ensureDbUser();
  if (!user) return { error: 'Not authenticated' };
  const beneficiary = await prisma.beneficiary.findUnique({ where: { userId: user.id } });
  if (!beneficiary) return { error: 'Beneficiary profile not found' };
  try {
    const request = await prisma.beneficiaryRequest.create({
      data: { beneficiaryId: beneficiary.id, category: data.category as any, quantity: data.quantity, description: data.description },
    });
    return { success: true, request };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getBeneficiaryRequests() {
  const user = await ensureDbUser();
  if (!user) return { requests: [] };
  const beneficiary = await prisma.beneficiary.findUnique({ where: { userId: user.id } });
  if (!beneficiary) return { requests: [] };
  try {
    const requests = await prisma.beneficiaryRequest.findMany({ where: { beneficiaryId: beneficiary.id }, orderBy: { createdAt: 'desc' } });
    return { requests };
  } catch (error: any) {
    return { error: error.message, requests: [] };
  }
}

export async function updateRequestStatus(requestId: string, status: string) {
  const user = await ensureDbUser();
  if (!user || (user.role !== 'NGO' && user.role !== 'ADMIN')) return { error: 'Not authorized' };
  try {
    const request = await prisma.beneficiaryRequest.update({
      where: { id: requestId },
      data: { status: status as any, fulfilledAt: status === 'FULFILLED' ? new Date() : undefined },
    });
    return { success: true, request };
  } catch (error: any) {
    return { error: error.message };
  }
}
