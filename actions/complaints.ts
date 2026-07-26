'use server';

import { prisma } from '@/lib/prisma';
import { ensureDbUser } from './auth';

export async function submitComplaint(data: { name: string; email: string; subject: string; message: string }) {
  const user = await ensureDbUser().catch(() => null);
  try {
    const complaint = await prisma.complaint.create({
      data: { ...data, userId: user?.id || null },
    });
    return { success: true, complaint };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getComplaints(params?: { status?: string; limit?: number; page?: number }) {
  const user = await ensureDbUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Not authorized', complaints: [] };
  try {
    const where: any = {};
    if (params?.status && params.status !== 'all') where.status = params.status;
    const limit = params?.limit || 20;
    const page = params?.page || 1;
    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip: (page - 1) * limit }),
      prisma.complaint.count({ where }),
    ]);
    return { complaints, total, totalPages: Math.ceil(total / limit) };
  } catch (error: any) {
    return { error: error.message, complaints: [] };
  }
}

export async function updateComplaintStatus(id: string, status: string, response?: string) {
  const user = await ensureDbUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Not authorized' };
  try {
    const complaint = await prisma.complaint.update({ where: { id }, data: { status, response } });
    return { success: true, complaint };
  } catch (error: any) {
    return { error: error.message };
  }
}
