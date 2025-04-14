// src/app/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES, PROTECTED_ROUTES } from "./lib/constants/routes"
import {verifySession, refreshSession} from './lib/api/auth/session/index';
import { setRefreshCookie, setAccessCookie, getCookie, deleteAuthCookie} from './lib/utils/cookies/auth/index';
import { AUTH_COOKIES } from './lib/constants/auth/cookies';

//https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths <-- To do here

export async function middleware(request: NextRequest) {
  const accessToken = await getCookie(AUTH_COOKIES.ACCESS_TOKEN);
  const refreshToken = await getCookie(AUTH_COOKIES.REFRESH_TOKEN);
  const isProtectedRoute = PROTECTED_ROUTES.has(request.nextUrl.pathname);
  console.log('Access Token:', accessToken); 
  console.log('Refresh Token:', refreshToken); 
  console.log('isProtectedRoute:', isProtectedRoute);

  if(!accessToken && refreshToken) {
    try{
      const data = await refreshSession(refreshToken);
      if (!data.state) {
        console.error('No session returned from refreshSession');
        await deleteAuthCookie(AUTH_COOKIES.ACCESS_TOKEN);
        await deleteAuthCookie(AUTH_COOKIES.REFRESH_TOKEN);
        return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
      }
      await setAccessCookie(data.session.access_token);
      await setRefreshCookie(data.session.refresh_token);
      return NextResponse.redirect(request.nextUrl);
    }
    catch (error) {
      throw new Error(typeof error === 'string' ? error : 'An unknown error occurred');
    }
  }

  if(isProtectedRoute) { 
    if (!accessToken) {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }

    const verification = await verifySession(accessToken);
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