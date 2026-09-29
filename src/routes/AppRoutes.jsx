import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout Imports
import { MainLayout } from '@/layout';

// Loading Fallback Component & ErrorBoundary
import { Spinner, ErrorBoundary } from '@/components';

// Resilient Lazy Loader (handles transient chunk load failures in production)
import { lazyWithRetry } from '@/utils/lazyWithRetry';

// Route Guard
import AdminRoute from '@/components/AdminRoute/AdminRoute';

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full py-12">
      <Spinner size="md" />
    </div>
  );
}

// Public Page Imports (Lazy-Loaded with Auto-Retry)
const Home = lazyWithRetry(() => import('../pages/Home/pages/Home'));
const About = lazyWithRetry(() => import('../pages/About/pages/About'));
const ArticlesList = lazyWithRetry(() => import('../pages/Articles/pages/ArticlesList'));
const ArticleDetail = lazyWithRetry(() => import('../pages/Articles/pages/ArticleDetail'));
const FatwasList = lazyWithRetry(() => import('../pages/Fatwas/pages/FatwasList'));
const FatwaDetail = lazyWithRetry(() => import('../pages/Fatwas/pages/FatwaDetail'));
const AskQuestion = lazyWithRetry(() => import('../pages/AskQuestion/pages/AskQuestion'));
const QAList = lazyWithRetry(() => import('../pages/QuestionsAnswers/pages/QAList'));
const QADetail = lazyWithRetry(() => import('../pages/QuestionsAnswers/pages/QADetail'));
const PublicationsList = lazyWithRetry(() => import('../pages/Publications/pages/PublicationsList'));
const BookDetail = lazyWithRetry(() => import('../pages/Publications/pages/BookDetail'));
const LecturesList = lazyWithRetry(() => import('../pages/Lectures/pages/LecturesList'));
const EventsList = lazyWithRetry(() => import('../pages/Events/pages/EventsList'));
const ContactPage = lazyWithRetry(() => import('../pages/Contact/pages/ContactPage'));
const PageNotFound = lazyWithRetry(() => import('../pages/PageNotFound/pages/PageNotFound'));
const MyDetails = lazyWithRetry(() => import('../pages/User/pages/MyDetails'));
const Login = lazyWithRetry(() => import('../pages/Admin/pages/Login'));
const Signup = lazyWithRetry(() => import('../pages/Admin/pages/Signup'));
const ForgotPassword = lazyWithRetry(() => import('../pages/Admin/pages/ForgotPassword'));
const ResetPassword = lazyWithRetry(() => import('../pages/Admin/pages/ResetPassword'));

// Admin Page Imports (Lazy-Loaded with Auto-Retry)
const AdminLayout = lazyWithRetry(() => import('@/layout/AdminLayout'));
const Dashboard = lazyWithRetry(() => import('../pages/Admin/pages/Dashboard'));
const ManageArticles = lazyWithRetry(() => import('../pages/Admin/pages/ManageArticles'));
const ManageFatwas = lazyWithRetry(() => import('../pages/Admin/pages/ManageFatwas'));
const ManageQuestions = lazyWithRetry(() => import('../pages/Admin/pages/ManageQuestions'));
const ManagePublications = lazyWithRetry(() => import('../pages/Admin/pages/ManagePublications'));
const ManageLectures = lazyWithRetry(() => import('../pages/Admin/pages/ManageLectures'));
const ManageEvents = lazyWithRetry(() => import('../pages/Admin/pages/ManageEvents'));
const ManageSettings = lazyWithRetry(() => import('../pages/Admin/pages/ManageSettings'));
const ManageUsers = lazyWithRetry(() => import('../pages/Admin/pages/ManageUsers'));
const ManageComments = lazyWithRetry(() => import('../pages/Admin/pages/ManageComments'));
const ManageNotifications = lazyWithRetry(() => import('../pages/Admin/pages/ManageNotifications'));
const ManageMessages = lazyWithRetry(() => import('../pages/Admin/pages/ManageMessages'));

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public site (Urdu + RTL, has Navbar + Footer) ── */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />

            <Route path="articles" element={<ArticlesList />} />
            <Route path="articles/slug/:slug" element={<ArticleDetail />} />
            <Route path="articles/:slug" element={<ArticleDetail />} />

            <Route path="fatwas" element={<FatwasList />} />
            <Route path="fatwas/slug/:slug" element={<FatwaDetail />} />
            <Route path="fatwas/:slug" element={<FatwaDetail />} />

            <Route path="ask" element={<AskQuestion />} />
            <Route path="qa" element={<QAList />} />
            <Route path="qa/slug/:slug" element={<QADetail />} />
            <Route path="qa/:slug" element={<QADetail />} />
            <Route path="questions/slug/:slug" element={<QADetail />} />
            <Route path="questions/:slug" element={<QADetail />} />
            <Route path="publications" element={<PublicationsList />} />
            <Route path="publications/slug/:slug" element={<BookDetail />} />
            <Route path="publications/:slug" element={<BookDetail />} />
            <Route path="books" element={<PublicationsList />} />
            <Route path="books/slug/:slug" element={<BookDetail />} />
            <Route path="books/:slug" element={<BookDetail />} />
            <Route path="lectures" element={<LecturesList />} />
            <Route path="events" element={<EventsList />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="my-details" element={<MyDetails />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="new-password/:token" element={<ResetPassword />} />
            <Route path="new-password" element={<ResetPassword />} />
            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* ── Admin Console (full-screen, no public Navbar/Footer) ── */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/articles" element={<ManageArticles />} />
              <Route path="/admin/fatwas" element={<ManageFatwas />} />
              <Route path="/admin/questions" element={<ManageQuestions />} />
              <Route path="/admin/publications" element={<ManagePublications />} />
              <Route path="/admin/lectures" element={<ManageLectures />} />
              <Route path="/admin/events" element={<ManageEvents />} />
              <Route path="/admin/messages" element={<ManageMessages />} />
              <Route path="/admin/settings" element={<ManageSettings />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/comments" element={<ManageComments />} />
              <Route path="/admin/notifications" element={<ManageNotifications />} />
            </Route>
          </Route>

        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
