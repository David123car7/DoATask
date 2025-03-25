import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/session'; // Ensure this function correctly decrypts JWT or session data
import { cookies } from 'next/headers';

// 1. Define protected and public routes
const protectedRoutes = ['/tasks/create', '/profile'];
const publicRoutes = ['/signin', '/signup', '/'];

// Middleware function to handle authentication
export default async function middleware(req: NextRequest) {
  // 2. Get current path
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Get the Authentication cookie (issued by NestJS backend)
  const cookie = req.cookies.get('Authentication')?.value;
  console.log(cookie);

  // 4. Verify session
  let session;
  if (cookie) {
    try {
      session = await decrypt(cookie); // Ensure decrypt handles JWT or session logic correctly
    } catch (error) {
      console.error('Invalid session:', error);
    }
  }

  // 5. Redirect if user is not authenticated for protected routes
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/auth/signup', req.nextUrl));
  }

  // 6. Redirect if user is authenticated and tries to access a public page
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/tasks/create', req.nextUrl));
  }

  return NextResponse.next();
}