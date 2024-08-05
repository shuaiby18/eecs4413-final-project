import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/dashboard',
];
const unprotectedRoutes = ['/login', '/register'];

import { auth } from '@/lib/auth';

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const isProtectedRoute = protectedRoutes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );

  // console.log("middleware", Boolean(session), request.nextUrl.pathname, request.nextUrl.origin)

  if (!session && isProtectedRoute) {
    // console.log("no session and protected route", Boolean(!session) , isProtectedRoute)
    const absoluteURL = new URL('/login', request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  if (session && unprotectedRoutes.includes(request.nextUrl.pathname)) {
    // console.log("no session and unprotected route", Boolean(session) , unprotectedRoutes.includes(request.nextUrl.pathname))
    const absoluteURL = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}