'use server';

import { prisma } from '@/lib/prisma';
import { ensureDbUser } from './auth';

export async function getAdminStats() {
  const user = await ensureDbUser();
  if (!user || user.role !== 'ADMIN') return null;

  const [totalUsers, totalNgos, totalDonations, pendingNgos, totalBeneficiaries, completedDonations] = await Promise.all([
    prisma.user.count(),
    prisma.ngo.count(),
    prisma.donation.count(),
    prisma.ngo.count({ where: { verificationStatus: 'PENDING' } }),
    prisma.beneficiary.count(),
    prisma.donation.count({ where: { status: 'COMPLETED' } }),
  ]);

  const totalItemsDonated = await prisma.donationItem.aggregate({ _sum: { quantity: true } });

  // Donations by status
  const statuses = ['PENDING', 'ACCEPTED', 'PICKUP_SCHEDULED', 'COLLECTED', 'RECEIVED', 'DISTRIBUTED', 'COMPLETED', 'CANCELLED'];
  const statusCounts = await Promise.all(statuses.map(async (s) => ({
    status: s, count: await prisma.donation.count({ where: { status: s as any } }),
  })));

  // Donations by month (last 6 months)
  const months: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const count = await prisma.donation.count({ where: { createdAt: { gte: start, lte: end } } });
    months.push({ month: start.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }), count });
  }

  return {
    totalUsers, totalNgos, totalDonations, pendingNgos, totalBeneficiaries, completedDonations,
    totalItemsDonated: totalItemsDonated._sum.quantity || 0,
    donationsByStatus: statusCounts,
    donationsByMonth: months,
  };
}
