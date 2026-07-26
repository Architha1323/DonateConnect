'use server';

import { prisma } from '@/lib/prisma';
import { ensureDbUser } from './auth';

export async function updateProfile(data: {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}) {
  const user = await ensureDbUser();
  if (!user) return { error: 'Not authenticated' };

  try {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
    });
    return { success: true, user: updated };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getUsers(params?: { role?: string; search?: string; limit?: number; page?: number }) {
  const user = await ensureDbUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Not authorized', users: [] };

  try {
    const where: any = {};
    if (params?.role && params.role !== 'all') where.role = params.role;
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const limit = params?.limit || 20;
    const page = params?.page || 1;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, name: true, email: true, phone: true, role: true, isActive: true, isVerified: true, createdAt: true, avatar: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total, totalPages: Math.ceil(total / limit) };
  } catch (error: any) {
    return { error: error.message, users: [] };
  }
}

export async function deleteUser(userId: string) {
  const user = await ensureDbUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Not authorized' };

  try {
    await prisma.user.update({ where: { id: userId }, data: { isActive: false } });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateUserRole(userId: string, role: string) {
  const user = await ensureDbUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Not authorized' };

  try {
    await prisma.user.update({ where: { id: userId }, data: { role: role as any } });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
