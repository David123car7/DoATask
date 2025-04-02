export const ROUTES = {
  HOME: '/',
  HOME_AUTHENTICATED: '/home',
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  MESSAGE: '/message' //just for testing
};

export const PROTECTED_ROUTES = new Set([
  '/home',
  '/auth/test',
  '/message'
]);