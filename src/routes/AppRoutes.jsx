import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout Imports
import { MainLayout, AuthLayout } from '@/layout';
import AdminLayout from '@/layout/AdminLayout';

// Public Page Imports
import Home from '../pages/Home/pages/Home';
import About from '../pages/About/pages/About';
import ArticlesList from '../pages/Articles/pages/ArticlesList';
import ArticleDetail from '../pages/Articles/pages/ArticleDetail';
import FatwasList from '../pages/Fatwas/pages/FatwasList';
import FatwaDetail from '../pages/Fatwas/pages/FatwaDetail';
import AskQuestion from '../pages/AskQuestion/pages/AskQuestion';
import QAList from '../pages/QuestionsAnswers/pages/QAList';
import QADetail from '../pages/QuestionsAnswers/pages/QADetail';
import PublicationsList from '../pages/Publications/pages/PublicationsList';
import BookDetail from '../pages/Publications/pages/BookDetail';
import LecturesList from '../pages/Lectures/pages/LecturesList';
import EventsList from '../pages/Events/pages/EventsList';
import ContactPage from '../pages/Contact/pages/ContactPage';
import PageNotFound from '../pages/PageNotFound/pages/PageNotFound';
import MyDetails from '../pages/User/pages/MyDetails';
// import YouTubeVideos from '../pages/YouTubeVideos/YouTubeVideos';

// Admin Page Imports
import Login from '../pages/Admin/pages/Login';
import Signup from '../pages/Admin/pages/Signup';
import Dashboard from '../pages/Admin/pages/Dashboard';
import ManageArticles from '../pages/Admin/pages/ManageArticles';
import ManageFatwas from '../pages/Admin/pages/ManageFatwas';
import ManageQuestions from '../pages/Admin/pages/ManageQuestions';
import ManagePublications from '../pages/Admin/pages/ManagePublications';
import ManageLectures from '../pages/Admin/pages/ManageLectures';
import ManageEvents from '../pages/Admin/pages/ManageEvents';
import ManageSettings from '../pages/Admin/pages/ManageSettings';
import ManageUsers from '../pages/Admin/pages/ManageUsers';
import ManageComments from '../pages/Admin/pages/ManageComments';
// import YouTubeManager from '../pages/Admin/pages/YouTubeManager';

// Route Guard
import { AdminRoute } from '@/components';

export default function AppRoutes() {
  return (
    <Routes>

      {/* ── Authentication pages (English + LTR, no Navbar/Footer) ── */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* ── Public site (Urdu + RTL, has Navbar + Footer) ── */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />

        <Route path="articles" element={<ArticlesList />} />
        <Route path="articles/slug/:slug" element={<ArticleDetail />} />
        <Route path="articles/:slug" element={<ArticleDetail />} />
        <Route path="articles/:id" element={<ArticleDetail />} />

        <Route path="fatwas" element={<FatwasList />} />
        <Route path="fatwas/:slug" element={<FatwaDetail />} />

        <Route path="ask" element={<AskQuestion />} />
        <Route path="qa" element={<QAList />} />
        <Route path="qa/slug/:slug" element={<QADetail />} />
        <Route path="qa/:slug" element={<QADetail />} />
        <Route path="publications" element={<PublicationsList />} />
        <Route path="publications/slug/:slug" element={<BookDetail />} />
        <Route path="publications/:slug" element={<BookDetail />} />
        <Route path="books/slug/:slug" element={<BookDetail />} />
        <Route path="books/:slug" element={<BookDetail />} />
        <Route path="lectures" element={<LecturesList />} />
        <Route path="events" element={<EventsList />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="my-details" element={<MyDetails />} />
        {/* <Route path="youtube-videos" element={<YouTubeVideos />} /> */}
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
          {/* <Route path="/admin/youtube" element={<YouTubeManager />} /> */}
        </Route>
      </Route>

    </Routes>
  );
}
