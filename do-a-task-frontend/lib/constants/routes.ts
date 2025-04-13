export const ROUTES = {
  HOME: '/',
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  RESET_PASSWORD: '/auth/requestResetPassword',
  USER_MAIN: '/user/main',
  PRIVATE: '/private' //just for testing
};

export const API_ROUTES = {
  SIGNOUT: '/auth/signout',
};

export const PROTECTED_ROUTES = new Set([
  '/auth/test',
  '/user/main'
]);