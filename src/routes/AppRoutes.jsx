import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout Imports
import { MainLayout } from '@/layout';

// Loading Fallback Component
import { Spinner } from '@/components/Loader';

// Route Guard
import AdminRoute from '@/components/AdminRoute/AdminRoute';

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full py-12">
      <Spinner size="md" />
    </div>
  );
}

// Public Page Imports (Lazy-Loaded)
const Home = lazy(() => import('../pages/Home/pages/Home'));
const About = lazy(() => import('../pages/About/pages/About'));
const ArticlesList = lazy(() => import('../pages/Articles/pages/ArticlesList'));
const ArticleDetail = lazy(() => import('../pages/Articles/pages/ArticleDetail'));
const FatwasList = lazy(() => import('../pages/Fatwas/pages/FatwasList'));
const FatwaDetail = lazy(() => import('../pages/Fatwas/pages/FatwaDetail'));
const AskQuestion = lazy(() => import('../pages/AskQuestion/pages/AskQuestion'));
const QAList = lazy(() => import('../pages/QuestionsAnswers/pages/QAList'));
const QADetail = lazy(() => import('../pages/QuestionsAnswers/pages/QADetail'));
const PublicationsList = lazy(() => import('../pages/Publications/pages/PublicationsList'));
const BookDetail = lazy(() => import('../pages/Publications/pages/BookDetail'));
const LecturesList = lazy(() => import('../pages/Lectures/pages/LecturesList'));
const EventsList = lazy(() => import('../pages/Events/pages/EventsList'));
const ContactPage = lazy(() => import('../pages/Contact/pages/ContactPage'));
const PageNotFound = lazy(() => import('../pages/PageNotFound/pages/PageNotFound'));
const MyDetails = lazy(() => import('../pages/User/pages/MyDetails'));
const Login = lazy(() => import('../pages/Admin/pages/Login'));
const Signup = lazy(() => import('../pages/Admin/pages/Signup'));
const ForgotPassword = lazy(() => import('../pages/Admin/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/Admin/pages/ResetPassword'));

// Admin Page Imports (Lazy-Loaded)
const AdminLayout = lazy(() => import('@/layout/AdminLayout'));
const Dashboard = lazy(() => import('../pages/Admin/pages/Dashboard'));
const ManageArticles = lazy(() => import('../pages/Admin/pages/ManageArticles'));
const ManageFatwas = lazy(() => import('../pages/Admin/pages/ManageFatwas'));
const ManageQuestions = lazy(() => import('../pages/Admin/pages/ManageQuestions'));
const ManagePublications = lazy(() => import('../pages/Admin/pages/ManagePublications'));
const ManageLectures = lazy(() => import('../pages/Admin/pages/ManageLectures'));
const ManageEvents = lazy(() => import('../pages/Admin/pages/ManageEvents'));
const ManageSettings = lazy(() => import('../pages/Admin/pages/ManageSettings'));
const ManageUsers = lazy(() => import('../pages/Admin/pages/ManageUsers'));
const ManageComments = lazy(() => import('../pages/Admin/pages/ManageComments'));
const ManageNotifications = lazy(() => import('../pages/Admin/pages/ManageNotifications'));

export default function AppRoutes() {
  return (
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
          <Route path="fatwas/:slug" element={<FatwaDetail />} />

          <Route path="ask" element={<AskQuestion />} />
          <Route path="qa" element={<QAList />} />
          <Route path="qa/slug/:slug" element={<QADetail />} />
          <Route path="qa/:slug" element={<QADetail />} />
          <Route path="publications" element={<PublicationsList />} />
          <Route path="publications/slug/:slug" element={<BookDetail />} />
          <Route path="publications/:slug" element={<BookDetail />} />
          <Route path="books" element={<PublicationsList />} />
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
            <Route path="/admin/settings" element={<ManageSettings />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/comments" element={<ManageComments />} />
            <Route path="/admin/notifications" element={<ManageNotifications />} />
          </Route>
        </Route>

      </Routes>
    </Suspense>
  );
}
