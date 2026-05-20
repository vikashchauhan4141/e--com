import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back to COCO!', {
        icon: '✨',
        style: {
          background: '#0A0A0A',
          color: '#FAFAFA',
          borderLeft: '3px solid #9B7EC8',
          borderRadius: '0',
          fontSize: '13px',
        }
      });
      navigate('/');
    } catch (err) {
      toast.error('Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper pt-20 bg-[#FAFAFA] flex items-center justify-center px-4 py-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-gray-100 shadow-lg p-6 md:p-8 lg:p-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex flex-col items-center mb-6">
            <span className="font-playfair text-2xl md:text-[32px] font-bold tracking-[6px] md:tracking-[8px] text-[#0A0A0A] leading-none">
              COCO
            </span>
            <span className="text-[9px] tracking-[4px] text-[#9B7EC8] font-inter font-medium mt-1">
              FASHION
            </span>
          </div>
          <h2 className="font-playfair text-lg md:text-xl font-semibold mb-1">Welcome Back</h2>
          <p className="text-xs text-gray-400 font-inter">Sign in to access your dashboard & order details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold tracking-wider uppercase text-gray-600">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="isabelle@coco.com"
                defaultValue="isabelle@coco.com"
                className={`input-coco pl-12 ${errors.email ? 'border-red-400' : ''}`}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-500 font-inter flex items-center gap-1 mt-1">
                <ShieldAlert size={12} /> {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-gray-600">Password</label>
              <Link to="/login" className="text-[10px] text-gray-400 hover:text-black tracking-wide font-inter whitespace-nowrap">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                defaultValue="password123"
                className={`input-coco pl-12 ${errors.password ? 'border-red-400' : ''}`}
                {...register('password', { required: 'Password is required' })}
              />
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-500 font-inter flex items-center gap-1 mt-1">
                <ShieldAlert size={12} /> {errors.password.message}
              </p>
            )}
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center gap-2 py-4 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={14} />
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-50">
          <p className="text-xs text-gray-400 font-inter">
            Don't have an account?{' '}
            <Link to="/contact" className="text-black font-semibold hover:text-[#9B7EC8] underline transition-colors">
              Contact Concierge
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
