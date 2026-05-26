import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook for accessing the auth context.
 * Use this instead of importing AuthContext + useContext everywhere.
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
