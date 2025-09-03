import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const AdminRoute = ({ children }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  console.log('[AdminRoute] Auth state:', { 
    hasUser: !!user, 
    userEmail: user?.email, 
    role, 
    loading,
    pathname: location.pathname 
  });

  if (loading) {
    console.log('[AdminRoute] Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  if (!user) {
    console.log('[AdminRoute] No user, redirecting to login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const email = (user?.email || '').toLowerCase();
  const isFallbackAdmin = ['indiacustomerhelp05@gmail.com', 'newmess1231@gmail.com', 'abhishekuniyal282@gmail.com'].includes(email);

  if (role !== 'admin' && !isFallbackAdmin) {
    console.log('[AdminRoute] User is not admin, redirecting to dashboard. Role:', role, 'Email:', email);
    return <Navigate to="/dashboard" replace />;
  }

  console.log('[AdminRoute] User is admin, rendering admin panel');
  return children;
};

export default AdminRoute;



