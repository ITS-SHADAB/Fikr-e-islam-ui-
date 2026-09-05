import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '@/components';

export default function AdminRoute() {
  const { isAuthenticated, loading, userRole } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner size="lg" text="ایڈمن پینل لوڈ ہو رہا ہے..." />
      </div>
    );
  }

  return isAuthenticated && userRole === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
}
