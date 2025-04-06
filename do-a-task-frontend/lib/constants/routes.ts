export const ROUTES = {
  HOME: '/',
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  PRIVATE: '/private' //just for testing
};

export const API_ROUTES = {
  SIGNOUT: '/auth/signout',
};

export const PROTECTED_ROUTES = new Set([
  '/auth/test',
]);