'use server';

import { prisma } from '@/lib/prisma';
import { ensureDbUser } from './auth';

export async function createDonation(data: {
  ngoId?: string;
  notes?: string;
  items: {
    itemName: string;
    category: string;
    quantity: number;
    condition: string;
    description?: string;
  }[];
  pickup: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    landmark?: string;
    scheduledDate: string;
    scheduledTime?: string;
    contactPhone: string;
  };
}) {
  const user = await ensureDbUser();
  if (!user) return { error: 'Not authenticated' };

  try {
    const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0);

    const donation = await prisma.donation.create({
      data: {
        donorId: user.id,
        ngoId: data.ngoId || null,
        notes: data.notes,
        totalItems,
        items: {
          create: data.items.map((item) => ({
            itemName: item.itemName,
            category: item.category as any,
            quantity: item.quantity,
            condition: item.condition as any,
            description: item.description,
          })),
        },
        pickupRequest: {
          create: {
            address: data.pickup.address,
            city: data.pickup.city,
            state: data.pickup.state,
            zipCode: data.pickup.zipCode,
            landmark: data.pickup.landmark,
            scheduledDate: new Date(data.pickup.scheduledDate),
            scheduledTime: data.pickup.scheduledTime,
            contactPhone: data.pickup.contactPhone,
          },
        },
        statusHistory: {
          create: {
            toStatus: 'PENDING',
            changedById: user.id,
            notes: 'Donation created',
          },
        },
      },
      include: { items: true, pickupRequest: true },
    });

    // Notify admin
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    await prisma.notification.createMany({
      data: admins.map((admin: any) => ({
        userId: admin.id,
        type: 'DONATION_CREATED' as any,
        title: 'New Donation',
        message: `${user.name} created a new donation with ${totalItems} items.`,
        link: `/admin/donations`,
      })),
    });

    if (data.ngoId) {
      const ngo = await prisma.ngo.findUnique({ where: { id: data.ngoId } });
      if (ngo) {
        await prisma.notification.create({
          data: {
            userId: ngo.userId,
            type: 'DONATION_CREATED' as any,
            title: 'New Direct Donation',
            message: `${user.name} directly assigned a donation to your NGO.`,
            link: `/ngo/donations`,
          }
        });
      }
    } else {
      // Notify all verified NGOs for open pool donations
      const verifiedNgos = await prisma.ngo.findMany({ where: { verificationStatus: 'VERIFIED' } });
      if (verifiedNgos.length > 0) {
        await prisma.notification.createMany({
          data: verifiedNgos.map(ngo => ({
            userId: ngo.userId,
            type: 'DONATION_CREATED' as any,
            title: 'New Open Pool Donation',
            message: `${user.name} created a new donation available in your area.`,
            link: `/ngo/donations`,
          })),
        });
      }
    }

    return { success: true, donation };
  } catch (error: any) {
    return { error: error.message || 'Failed to create donation' };
  }
}

export async function getDonations(params?: {
  status?: string;
  search?: string;
  limit?: number;
  page?: number;
  role?: string;
}) {
  const user = await ensureDbUser();
  if (!user) return { error: 'Not authenticated', donations: [] };

  try {
    const where: any = {};

    // Role-based filtering
    if (user.role === 'DONOR') {
      where.donorId = user.id;
    } else if (user.role === 'NGO') {
      const ngo = await prisma.ngo.findUnique({ where: { userId: user.id } });
      if (ngo) {
        where.OR = [{ ngoId: ngo.id }, { ngoId: null, status: 'PENDING' }];
      }
    }
    // ADMIN sees all

    if (params?.status && params.status !== 'all') {
      where.status = params.status;
    }

    if (params?.search) {
      where.items = { some: { itemName: { contains: params.search, mode: 'insensitive' } } };
    }

    const limit = params?.limit || 20;
    const page = params?.page || 1;

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        include: {
          items: true,
          pickupRequest: true,
          donor: { select: { id: true, name: true, email: true, avatar: true, city: true } },
          ngo: { select: { id: true, ngoName: true, city: true } },
          statusHistory: { orderBy: { changedAt: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.donation.count({ where }),
    ]);

    return { donations, total, page, totalPages: Math.ceil(total / limit) };
  } catch (error: any) {
    return { error: error.message, donations: [] };
  }
}

export async function getDonationById(id: string) {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: {
        items: true,
        pickupRequest: true,
        donor: { select: { id: true, name: true, email: true, avatar: true, city: true, phone: true } },
        ngo: { select: { id: true, ngoName: true, city: true } },
        statusHistory: { orderBy: { changedAt: 'asc' }, include: { changedBy: { select: { name: true } } } },
      },
    });

    return { donation };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateDonationStatus(donationId: string, newStatus: string, notes?: string) {
  const user = await ensureDbUser();
  if (!user) return { error: 'Not authenticated' };

  try {
    const donation = await prisma.donation.findUnique({ where: { id: donationId } });
    if (!donation) return { error: 'Donation not found' };

    // Status workflow validation
    const validTransitions: Record<string, string[]> = {
      PENDING: ['ACCEPTED', 'CANCELLED'],
      ACCEPTED: ['PICKUP_SCHEDULED', 'CANCELLED'],
      PICKUP_SCHEDULED: ['COLLECTED', 'CANCELLED'],
      COLLECTED: ['RECEIVED'],
      RECEIVED: ['DISTRIBUTED'],
      DISTRIBUTED: ['COMPLETED'],
    };

    if (!validTransitions[donation.status]?.includes(newStatus)) {
      return { error: `Cannot transition from ${donation.status} to ${newStatus}` };
    }

    // For accept, assign NGO
    const updateData: any = { status: newStatus };
    if (newStatus === 'ACCEPTED' && user.role === 'NGO') {
      const ngo = await prisma.ngo.findUnique({ where: { userId: user.id } });
      if (ngo) updateData.ngoId = ngo.id;
    }

    const updated = await prisma.donation.update({
      where: { id: donationId },
      data: updateData,
      include: { items: true, donor: { select: { id: true, name: true } } },
    });

    // Create status history
    await prisma.statusHistory.create({
      data: {
        donationId,
        fromStatus: donation.status as any,
        toStatus: newStatus as any,
        notes,
        changedById: user.id,
      },
    });

    // Notify donor if they didn't make the change
    if (user.id !== updated.donorId) {
      let donorMessage = `Your donation status has been updated to ${newStatus.replace('_', ' ').toLowerCase()}.`;
      if (newStatus === 'RECEIVED') {
        const actingNgo = await prisma.ngo.findUnique({ where: { userId: user.id } });
        donorMessage = `Your donation has been successfully received${actingNgo ? ` by ${actingNgo.ngoName}` : ''}. Thank you for your generosity!`;
      }
      
      await prisma.notification.create({
        data: {
          userId: updated.donorId,
          type: 'DONATION_STATUS_UPDATE' as any,
          title: newStatus === 'RECEIVED' ? 'Donation Received!' : `Donation ${newStatus.replace('_', ' ').toLowerCase()}`,
          message: donorMessage,
          link: `/donor/donations/${donationId}`,
        },
      });
    }

    // Notify assigned NGO if they didn't make the change
    if (updated.ngoId) {
      const assignedNgo = await prisma.ngo.findUnique({ where: { id: updated.ngoId } });
      if (assignedNgo && assignedNgo.userId !== user.id) {
        await prisma.notification.create({
          data: {
            userId: assignedNgo.userId,
            type: 'DONATION_STATUS_UPDATE' as any,
            title: `Donation ${newStatus.replace('_', ' ').toLowerCase()}`,
            message: `A donation assigned to you was updated to ${newStatus.replace('_', ' ').toLowerCase()}.`,
            link: `/ngo/donations`,
          },
        });
      }
    }

    return { success: true, donation: updated };
  } catch (error: any) {
    return { error: error.message || 'Failed to update status' };
  }
}

export async function deleteDonation(donationId: string) {
  const user = await ensureDbUser();
  if (!user) return { error: 'Not authenticated' };

  try {
    const donation = await prisma.donation.findUnique({ where: { id: donationId } });
    if (!donation) return { error: 'Donation not found' };
    if (donation.donorId !== user.id && user.role !== 'ADMIN') return { error: 'Not authorized' };
    if (donation.status !== 'PENDING') return { error: 'Only pending donations can be deleted' };

    await prisma.donation.delete({ where: { id: donationId } });
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to delete donation' };
  }
}

export async function getDonorStats() {
  const user = await ensureDbUser();
  if (!user) return null;

  const [totalDonations, activeDonations, completedDonations, cancelledDonations] = await Promise.all([
    prisma.donation.count({ where: { donorId: user.id } }),
    prisma.donation.count({ where: { donorId: user.id, status: { notIn: ['COMPLETED', 'CANCELLED'] } } }),
    prisma.donation.count({ where: { donorId: user.id, status: 'COMPLETED' } }),
    prisma.donation.count({ where: { donorId: user.id, status: 'CANCELLED' } }),
  ]);

  const totalItemsDonated = await prisma.donationItem.aggregate({
    where: { donation: { donorId: user.id } },
    _sum: { quantity: true },
  });

  return {
    totalDonations,
    activeDonations,
    completedDonations,
    cancelledDonations,
    totalItemsDonated: totalItemsDonated._sum.quantity || 0,
  };
}
