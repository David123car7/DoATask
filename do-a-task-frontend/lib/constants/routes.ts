export const ROUTES = {
  HOME: '/',
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  PRIVATE: '/private' //just for testing
};

export const API_ROUTES = {
  SIGNOUT: '/lib/api/auth/authentication/signout',
};

export const PROTECTED_ROUTES = new Set([
  '/auth/test',
]);