export const ROUTES = {
  HOME: '/',
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  RESET_PASSWORD: '/auth/requestResetPassword',
  USER_MAIN: '/user/main',
  NOTIFICATION_LIST: '/notificationList',
  COMMUNITIES:'/associateToCommunity',
  ENTER_COMMUNITY: '/community/list/enterCommunity',
  USER_COMMUNITY: '/community/list/userCommunity'
};

export const API_ROUTES = {
  SIGNOUT: '/auth/signout',
};

export const PROTECTED_ROUTES = new Set([
  '/auth/test',
  '/user/main',
  '/notificationList',
  '/community/list/enterCommunity',
  '/community/list/userCommunity'
]);