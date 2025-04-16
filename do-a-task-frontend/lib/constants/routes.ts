export const ROUTES = {
  HOME: '/',
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  RESET_PASSWORD: '/auth/requestResetPassword',
  USER_MAIN: '/user/main',
  NOTIFICATION_LIST: '/notificationList',
  COMMUNITIES:'/associateToCommunity',
  ENTER_COMMUNITY: '/community/list/enterCommunity',
  USER_COMMUNITY: '/community/list/userCommunity',
  TASKS_LIST: '/tasks/list',
  TASKS_USER_LIST: '/tasks/listTasksUser',
};

export const API_ROUTES = {
  SIGNOUT: '/auth/signout',
};

export const PROTECTED_ROUTES = new Set([
  ROUTES.USER_MAIN,
  ROUTES.NOTIFICATION_LIST,
  ROUTES.USER_COMMUNITY,
  ROUTES.ENTER_COMMUNITY,
  ROUTES.TASKS_LIST,
  ROUTES.TASKS_USER_LIST,
]);