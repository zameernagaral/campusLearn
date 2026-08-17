import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected route patterns
const PROTECTED_ROUTES = [
  '/student',
  '/faculty',
  '/hod',
  '/admin',
  '/dashboard',
];

const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  // Get token and role from cookie
  const token = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') === 'http') {
    const host = request.headers.get('host') || request.nextUrl.host;
    return NextResponse.redirect(`https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`, 301);
  }

  // Enforce server side auth: Redirect unauthenticated users to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If accessing auth route while logged in, redirect to their dashboard
  if (isAuthRoute && token) {
    const role = userRole || 'student';
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
  }

  // Enforce strict role isolation based on the URL path
  if (isProtected && token && userRole) {
    if (pathname.startsWith('/student') && userRole !== 'student') {
      return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
    }
    if (pathname.startsWith('/faculty') && userRole !== 'faculty') {
      return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
    }
    if (pathname.startsWith('/hod') && userRole !== 'hod') {
      return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
    }
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
