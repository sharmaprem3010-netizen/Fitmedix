import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/home', '/ai-guide', '/medicine', '/admin', '/onboarding',
  '/diseases', '/diets', '/exercises', '/yoga', '/scan', '/report-translator',
  '/schedule', '/health-records', '/qa'];

// Routes only accessible to admin users
const adminRoutes = ['/admin'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Not authenticated — redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, public assets
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|logo\\.jpeg).*)',
  ],
};
