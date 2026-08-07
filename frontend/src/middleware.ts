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
  
  // Get token from cookie or header
  // Note: For proper JWT validation in middleware, we'd need a lightweight JWT check
  // The full auth check happens in the client via authStore
  const token = request.cookies.get('accessToken')?.value;

  // If accessing auth route while logged in, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
