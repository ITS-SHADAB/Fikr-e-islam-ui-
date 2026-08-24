// Route path constants — single source of truth for all application routes
export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',

  ARTICLES: '/articles',
  ARTICLE_DETAIL: '/articles/:slug',

  FATWAS: '/fatwas',
  FATWA_DETAIL: '/fatwas/:id',

  ASK: '/ask',
  QA: '/qa',

  PUBLICATIONS: '/publications',
  LECTURES: '/lectures',
  EVENTS: '/events',
  CONTACT: '/contact',

  // Admin routes
  ADMIN_LOGIN: '/login',
  ADMIN_SIGNUP: '/signup',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ARTICLES: '/admin/articles',
  ADMIN_FATWAS: '/admin/fatwas',
  ADMIN_QUESTIONS: '/admin/questions',
  ADMIN_PUBLICATIONS: '/admin/publications',
  ADMIN_LECTURES: '/admin/lectures',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_USERS: '/admin/users',
};
