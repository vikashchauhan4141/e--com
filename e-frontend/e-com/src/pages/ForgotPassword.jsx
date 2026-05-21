import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await api.post('/auth/forgot-password', { email });
      
      setIsSent(true);
      toast.success('Password reset link sent to your email.');
    } catch (err) {
      const errMsg = err.message || 'Failed to send reset link. Please check your email and try again.';
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
          <span className="font-heading font-semibold text-[10px] tracking-[0.2em] text-primary uppercase font-bold">Client Recovery</span>
          <h1 className="font-heading font-light text-2xl tracking-wide text-ink">Forgot Password</h1>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="font-sans text-xs text-secondary leading-relaxed mb-2">
              Enter your registered email address below. If an account matches, we will dispatch a secure link to reset your credentials.
            </p>

            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded text-error text-xs font-sans">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="vikas@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                  <span>Sending Link...</span>
                </>
              ) : (
                'Send Recovery Link'
              )}
            </Button>

            <p className="font-sans text-xs text-secondary text-center mt-3">
              Remembered your password?{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold">
                Client Sign In
              </Link>
            </p>
          </form>
        ) : (
          <div className="flex flex-col gap-5 py-4">
            <div className="p-4 bg-success/5 border border-success/15 rounded flex flex-col gap-2">
              <span className="font-heading font-medium text-xs tracking-wider text-success uppercase">Email Dispatched</span>
              <p className="font-sans text-xs text-secondary leading-relaxed">
                A high-security, temporary password reset link has been dispatched to <strong className="text-ink">{email}</strong>. Please check your inbox and spam folders.
              </p>
            </div>
            
            <p className="font-sans text-xs text-secondary leading-relaxed">
              This secure link is time-sensitive and will expire in exactly <span className="font-semibold text-ink">10 minutes</span>.
            </p>

            <div className="flex flex-col gap-2.5 mt-2">
              <Button 
                onClick={() => setIsSent(false)} 
                variant="secondary" 
                className="w-full py-3 text-xs tracking-wider uppercase"
              >
                Resend Link
              </Button>
              
              <Link to="/login" className="w-full">
                <Button 
                  variant="primary" 
                  className="w-full py-3.5 text-xs tracking-wider uppercase"
                >
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}

      </Card>
    </div>
  );
};
