import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const Login = () => {
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    
    try {
      setError('');
      await login(email, password);
    } catch (err) {
      setError(err.message || "Invalid email or password");
    }
  };

  return (
    <div className="max-w-container mx-auto px-6 py-20 flex justify-center items-center min-h-[75vh]">
      <Card padding="lg" className="w-full max-w-md border border-outline-variant text-left">
        
        <div className="flex flex-col gap-1.5 border-b border-outline-variant/60 pb-6 mb-6">
          <span className="font-heading font-semibold text-[10px] tracking-[0.2em] text-primary uppercase">Client Sign In</span>
          <h1 className="font-heading font-light text-2xl tracking-wide text-ink">Welcome to the Atelier</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end -mt-2">
            <Link to="/forgot-password" className="text-secondary hover:text-primary text-[10px] uppercase tracking-wider transition-colors duration-150">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3.5 mt-2">
            Sign In
          </Button>

          <p className="font-sans text-xs text-secondary text-center mt-3">
            New client?{' '}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Create an Account
            </Link>
          </p>
        </form>

      </Card>
    </div>
  );
};
