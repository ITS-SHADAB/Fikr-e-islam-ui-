import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthModal } from '@/context/AuthModalContext';

export default function AdminRoute() {
  const { isAuthenticated, loading, userRole } = useSelector((state) => state.auth);
  const { openLogin } = useAuthModal();

  useEffect(() => {
    if (!loading && (!isAuthenticated || userRole !== 'admin')) {
      openLogin();
    }
  }, [isAuthenticated, loading, userRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated && userRole === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
}
