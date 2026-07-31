import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ensureDbUser } from '@/actions/auth';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  let next = searchParams.get('next');
  const role = searchParams.get('role');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (role) {
        const cookieStore = await cookies();
        cookieStore.set('oauth_intended_role', role, { path: '/', maxAge: 60 * 5 }); // 5 minutes
      }

      // Ensure the user exists in DB and get their role so we can redirect to the correct dashboard
      const dbUser = await ensureDbUser();
      if (!next && dbUser) {
        const paths: Record<string, string> = { DONOR: '/donor/dashboard', NGO: '/ngo/dashboard', ADMIN: '/admin/dashboard', BENEFICIARY: '/beneficiary/dashboard' };
        next = paths[(dbUser.role || '').toUpperCase()] || '/';
      } else if (!next) {
        next = '/';
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      const redirectUrl = isLocalEnv ? `${origin}${next}` : (forwardedHost ? `https://${forwardedHost}${next}` : `${origin}${next}`);
      
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
