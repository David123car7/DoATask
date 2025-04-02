// src/app/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES, PROTECTED_ROUTES } from "./lib/constants/routes"
import { SessionService } from './app/api/session/session.api';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value; 
  console.log('Access Token:', accessToken); 
  const isProtectedRoute = PROTECTED_ROUTES.has(request.nextUrl.pathname);
  console.log('isProtectedRoute:', isProtectedRoute);

  if(isProtectedRoute) {
    if (!accessToken) {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }

    const verification = await SessionService.verifySession(accessToken);
    if (verification.valid === true) {
      return NextResponse.next();
    }
    else
      return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}