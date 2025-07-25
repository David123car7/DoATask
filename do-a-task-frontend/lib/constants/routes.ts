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
  CREATE_COMMUNITY: '/community/create',
  TASKS_USER_CREATED_LIST: '/tasks/list/tasksUserCreated',
  TASKS_USER__DOING_LIST: '/tasks/list/tasksUserDoing',
  TASKS_CREATE: '/tasks/create',
  TASKS_AVAILABLE: '/tasks/list/tasksAvailable',
  SHOPS: "/store/shops",
  MY_SHOP: "/store/myShop",
  MEMBER_PURCHASES: "/store/memberPurchases",
  CREATE_ITEM: "/store/createItem",
  RANKS: "/rank"
};

export const API_ROUTES = {
  SIGNOUT: '/auth/signout',
};

export const PROTECTED_ROUTES = new Set([
  ROUTES.USER_MAIN,
  ROUTES.NOTIFICATION_LIST,
  ROUTES.USER_COMMUNITY,
  ROUTES.ENTER_COMMUNITY,
  ROUTES.CREATE_COMMUNITY,
  ROUTES.TASKS_USER_CREATED_LIST,
  ROUTES.TASKS_USER__DOING_LIST,
  ROUTES.TASKS_CREATE,
  ROUTES.SHOPS,
  ROUTES.MY_SHOP,
  ROUTES.CREATE_ITEM,
  ROUTES.MEMBER_PURCHASES,
  ROUTES.RANKS
]);