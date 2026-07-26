'use server';

import { prisma } from '@/lib/prisma';
import { ensureDbUser } from './auth';

export async function getNotifications() {
  const user = await ensureDbUser();
  if (!user) return { notifications: [] };
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return { notifications };
  } catch { return { notifications: [] }; }
}

export async function markNotificationRead(id: string) {
  try {
    await prisma.notification.update({ where: { id }, data: { isRead: true } });
    return { success: true };
  } catch { return { error: 'Failed' }; }
}

export async function markAllNotificationsRead() {
  const user = await ensureDbUser();
  if (!user) return { error: 'Not authenticated' };
  try {
    await prisma.notification.updateMany({ where: { userId: user.id, isRead: false }, data: { isRead: true } });
    return { success: true };
  } catch { return { error: 'Failed' }; }
}

export async function getUnreadCount() {
  const user = await ensureDbUser();
  if (!user) return 0;
  return prisma.notification.count({ where: { userId: user.id, isRead: false } });
}
