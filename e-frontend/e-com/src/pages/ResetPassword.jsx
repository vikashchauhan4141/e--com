import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import toast from 'react-hot-toast';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength check
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: '', color: 'bg-outline-variant' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
      case 2:
        return { score, text: 'Weak password', color: 'bg-error' };
      case 3:
      case 4:
        return { score, text: 'Medium strength', color: 'bg-primary/60' };
      case 5:
        return { score, text: 'Strong password', color: 'bg-success' };
      default:
        return { score: 0, text: '', color: 'bg-outline-variant' };
    }
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await api.patch(`/auth/reset-password/${token}`, { newPassword });
      
      toast.success('Your password has been successfully reset.');
      navigate('/login');
    } catch (err) {
      const errMsg = err.message || 'Token is invalid or has expired. Please request a new recovery link.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-container mx-auto px-6 py-20 flex justify-center items-center min-h-[75vh]">
      <Card padding="lg" className="w-full max-w-md border border-outline-variant text-left">
        
        <div className="flex flex-col gap-1.5 border-b border-outline-variant/60 pb-6 mb-6">
          <span className="font-heading font-semibold text-[10px] tracking-[0.2em] text-primary uppercase font-bold">Secure Gateway</span>
          <h1 className="font-heading font-light text-2xl tracking-wide text-ink">Reset Credentials</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="font-sans text-xs text-secondary leading-relaxed mb-2">
            Establish a strong, unique passkey for your workspace account. Avoid repeating old credentials.
          </p>

          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded text-error text-xs font-sans">
              {error}
            </div>
          )}

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          {newPassword && (
            <div className="flex flex-col gap-1.5 -mt-1 mb-1">
              <div className="h-1 w-full bg-outline-variant/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${strength.color} transition-all duration-300`} 
                  style={{ width: `${(strength.score / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-secondary self-end">
                {strength.text}
              </span>
            </div>
          )}

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-3.5 mt-2 flex justify-center items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Securing Credentials...</span>
              </>
            ) : (
              'Reset Password'
            )}
          </Button>

          <p className="font-sans text-xs text-secondary text-center mt-3">
            Want to abort?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Return to Sign In
            </Link>
          </p>
        </form>

      </Card>
    </div>
  );
};
