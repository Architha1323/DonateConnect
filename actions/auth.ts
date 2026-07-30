'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { UserRole } from '@/types';

export async function signUp(formData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  // NGO-specific fields
  ngoName?: string;
  registrationNumber?: string;
  ngoAddress?: string;
  ngoCity?: string;
  ngoState?: string;
  ngoDescription?: string;
  // Beneficiary fields
  householdSize?: number;
  needCategory?: string[];
  beneficiaryDescription?: string;
}) {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: { name: formData.name, role: formData.role },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: 'Failed to create account' };
  }

  try {
    // Create user in our database
    const user = await prisma.user.create({
      data: {
        authId: authData.user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role as any,
      },
    });

    // Create role-specific profile
    if (formData.role === UserRole.NGO && formData.ngoName && formData.registrationNumber) {
      await prisma.ngo.create({
        data: {
          userId: user.id,
          ngoName: formData.ngoName,
          registrationNumber: formData.registrationNumber,
          address: formData.ngoAddress || '',
          city: formData.ngoCity || '',
          state: formData.ngoState || '',
          description: formData.ngoDescription,
        },
      });
    }

    if (formData.role === UserRole.BENEFICIARY) {
      await prisma.beneficiary.create({
        data: {
          userId: user.id,
          householdSize: formData.householdSize || null,
          needCategory: (formData.needCategory as any) || [],
          description: formData.beneficiaryDescription,
        },
      });
    }

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'SYSTEM',
        title: 'Welcome to DonateConnect!',
        message: `Your ${formData.role.toLowerCase()} account has been created successfully.`,
        link: `/${formData.role.toLowerCase()}/dashboard`,
      },
    });

    return { success: true, user };
  } catch (dbError: any) {
    return { error: dbError.message || 'Failed to create user profile' };
  }
}

export async function signIn(formData: { email: string; password: string }) {
  // Completely bypass Supabase for demo accounts to avoid email confirmation requirements
  if (formData.password === 'password123') {
    const cookieStore = await cookies();
    let demoRole = null;
    
    if (formData.email === 'rahul@example.com') demoRole = 'DONOR';
    if (formData.email === 'helping@example.com') demoRole = 'NGO';
    if (formData.email === 'admin@donateconnect.com') demoRole = 'ADMIN';

    if (demoRole) {
      cookieStore.set('demo_role_override', demoRole, { path: '/', maxAge: 60 * 60 * 24 });
      return { success: true };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { error: error.message };
  }

  const cookieStore = await cookies();
  cookieStore.delete('demo_role_override');

  return { success: true };
}

export async function signInWithGoogle(origin: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete('demo_role_override');
  redirect('/login');
}

export async function resetPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? '' : 'http://localhost:3000'}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get('demo_role_override')?.value;
  if (demoRole) {
    const emailMap: Record<string, string> = { 
      DONOR: 'rahul@example.com', 
      NGO: 'helping@example.com',
      ADMIN: 'admin@donateconnect.com'
    };
    const demoEmail = emailMap[demoRole];
    if (demoEmail) {
      return await prisma.user.findUnique({
        where: { email: demoEmail },
        include: { ngo: true, beneficiary: true },
      });
    }
  }

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const authUser = session?.user;

  if (!authUser) return null;

  const dbUser = await prisma.user.findUnique({
    where: { authId: authUser.id },
    include: {
      ngo: true,
      beneficiary: true,
    },
  });

  return dbUser;
}

export async function ensureDbUser() {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get('demo_role_override')?.value;
  if (demoRole) {
    const emailMap: Record<string, string> = { 
      DONOR: 'rahul@example.com', 
      NGO: 'helping@example.com',
      ADMIN: 'admin@donateconnect.com'
    };
    const demoEmail = emailMap[demoRole];
    if (demoEmail) {
      return await prisma.user.findUnique({
        where: { email: demoEmail },
        include: { ngo: true, beneficiary: true },
      });
    }
  }

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const authUser = session?.user;

  if (!authUser) return null;

  let dbUser = await prisma.user.findUnique({
    where: { authId: authUser.id },
    include: { ngo: true, beneficiary: true },
  });

  // Auto-create user in DB if they authenticated via OAuth but don't exist in DB yet
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        authId: authUser.id,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        email: authUser.email!,
        role: (authUser.user_metadata?.role as any) || 'DONOR',
        avatar: authUser.user_metadata?.avatar_url || null,
      },
      include: { ngo: true, beneficiary: true },
    });
  }

  return dbUser;
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: { ngo: true, beneficiary: true },
  });
}
