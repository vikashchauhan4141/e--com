import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const Register = () => {
  const { register, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (!name || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError('');
      await register(name, email, password);
    } catch (err) {
      setError(err.message || "Registration failed. Try a different email.");
    }
  };

  return (
    <div className="max-w-container mx-auto px-6 py-16 flex justify-center items-center min-h-[80vh]">
      <Card padding="lg" className="w-full max-w-md border border-outline-variant text-left">
        
        <div className="flex flex-col gap-1.5 border-b border-outline-variant/60 pb-6 mb-6">
          <span className="font-heading font-semibold text-[10px] tracking-[0.2em] text-primary uppercase font-bold">Client Registry</span>
          <h1 className="font-heading font-light text-2xl tracking-wide text-ink">Create Workspace</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded text-error text-xs font-sans">
              {error}
            </div>
          )}

          <Input
            label="Display Name"
            placeholder="Vikas Chauhan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" className="w-full py-3.5 mt-2">
            Create Account
          </Button>

          <p className="font-sans text-xs text-secondary text-center mt-3">
            Already registered?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Client Sign In
            </Link>
          </p>
        </form>

      </Card>
    </div>
  );
};
