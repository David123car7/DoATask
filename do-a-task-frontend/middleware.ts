// src/app/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES, PROTECTED_ROUTES } from "./lib/constants/routes"
import { SessionService } from './lib/api/auth/session/session-service';
import { AUTH_COOKIES } from './lib/constants/auth/cookies';
//https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths <-- To do here

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value; 
  const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;
  const isProtectedRoute = PROTECTED_ROUTES.has(request.nextUrl.pathname);
  console.log('Access Token:', accessToken); 
  console.log('Refresh Token:', refreshToken); 
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