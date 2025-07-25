"use server";

import { cookies } from 'next/headers';
import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";

export async function setAccessCookie(access_token: string) {
  const cookieStore = await cookies();
  const res = cookieStore.set(AUTH_COOKIES.ACCESS_TOKEN, access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 3600, // 15 minutes in seconds (900 seconds)
  });
  return res;
}

export async function setRefreshCookie(refresh_token: string) {
  const cookieStore = await cookies();
  const res = cookieStore.set(AUTH_COOKIES.REFRESH_TOKEN, refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 3600, // 1 hour in seconds (3600 seconds)
  });

  return res;
} 