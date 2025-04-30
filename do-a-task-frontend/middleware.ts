// src/app/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES, PROTECTED_ROUTES } from "./lib/constants/routes"
import {verifySession, refreshSession} from './lib/api/auth/session/index';
import { setRefreshCookie, setAccessCookie, getCookie, deleteAuthCookie} from './lib/utils/cookies/auth/index';
import { AUTH_COOKIES } from './lib/constants/auth/cookies';

//https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths <-- To do here

export async function middleware(request: NextRequest) {
  const accessToken = await getCookie(AUTH_COOKIES.ACCESS_TOKEN);
  const isProtectedRoute = PROTECTED_ROUTES.has(request.nextUrl.pathname);
  console.log('Access Token:', accessToken); 
  console.log('isProtectedRoute:', isProtectedRoute);

  if(isProtectedRoute) { 
    if (!accessToken) {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }

    const verification = await verifySession(accessToken);
    if (verification.valid === true) {
      return NextResponse.next();
    }
    else{
      await deleteAuthCookie(AUTH_COOKIES.ACCESS_TOKEN)
      return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
    }
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