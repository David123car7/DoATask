// src/app/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES, PROTECTED_ROUTES } from "./lib/constants/routes"
import {verifySession, refreshSession} from './lib/api/auth/session/index';
import { SetCookies, GetCookies, DeleteCookies} from './lib/utils/cookies/index';

//https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths <-- To do here

export async function middleware(request: NextRequest) {
  const getCookies = new GetCookies()
  const accessToken = await getCookies.getAuthCookie(request);
  const refreshToken = await getCookies.getRefreshCookie(request);
  const isProtectedRoute = PROTECTED_ROUTES.has(request.nextUrl.pathname);
  console.log('Access Token:', accessToken); 
  console.log('Refresh Token:', refreshToken); 
  console.log('isProtectedRoute:', isProtectedRoute);

  if(!accessToken && refreshToken) {
    try{
      const setCookies = new SetCookies()
      const deleteCookies = new DeleteCookies()
      const response = NextResponse.next();
      const data = await refreshSession(refreshToken);
      if (!data.session) {
        console.error('No session returned from refreshSession:', data);
        deleteCookies.deleteRefreshCookie(response, refreshToken);
        return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
      }
      await setCookies.setAuthCookie(response, data.session.access_token);
      await setCookies.setRefreshCookie(response, data.session.refresh_token);
      return response;
    }
    catch (error) {
      console.error('Error refreshing session:', error);
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