export const AUTH_COOKIES = {
    ACCESS_TOKEN: 'access-token',
    REFRESH_TOKEN: 'refresh-token',
};

export const ACESS_TOKEN_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as "lax" | "strict" | "none" | undefined,
    path: '/',
    maxAge: 10 * 1000, // 10 seconds in milliseconds
  };

export const REFRESH_TOKEN_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as "lax" | "strict" | "none" | undefined,
    path: '/',
    maxAge: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
};