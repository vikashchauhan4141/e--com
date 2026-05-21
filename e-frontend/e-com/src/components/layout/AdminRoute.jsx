import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] tracking-[0.2em] text-secondary uppercase animate-pulse">Loading Atelier Workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user.role !== 'admin') {
    // Show error toast dynamically
    toast.error('Access Denied: Administration credentials required');
    return <Navigate to="/" replace />;
  }

  return children;
};
