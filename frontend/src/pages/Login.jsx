import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../store/slices/authSlice';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    if (isSuccess && user) {
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : 
               user.role === 'admin' ? '/admin/dashboard' : '/patient/dashboard');
      toast.success('Welcome back!');
      dispatch(reset());
    }
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    dispatch(login(formData));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-scale-in">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center mb-4">
              <span className="text-white text-3xl font-bold">M</span>
            </div>
            <h1 className="text-2xl font-bold text-gradient">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Login to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="ml-2 text-sm">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              Demo Credentials:
            </p>
            <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <p>Patient: patient@demo.com / password123</p>
              <p>Doctor: doctor@demo.com / password123</p>
              <p>Admin: admin@demo.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;