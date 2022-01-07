import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;
  // Allow the requests if the following is true
  // 1) Its a request for next-auth session & provider fetching
  // 2) the token exists

  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next();
  }

  // Otherwise redirect to the login page
  if (!token && pathname !== '/login') {
    return NextResponse.redirect('/login');
  }
}
