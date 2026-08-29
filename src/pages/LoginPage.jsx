import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearAuthError } from '../store/slices/authSlice';
import { isValidEmail } from '../utils/helpers';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(loginUser({ email: form.email, password: form.password }));
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Left — Decoration panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-bg-secondary border-r border-border">
        {/* Animated blobs */}
        <div
          className="absolute w-96 h-96 rounded-full opacity-10 -top-24 -left-24 bg-accent-primary"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
        <div
          className="absolute w-72 h-72 rounded-full opacity-10 -bottom-16 -right-12 bg-income"
          style={{ animation: 'float 6s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute w-48 h-48 rounded-full opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-secondary"
          style={{ animation: 'float 10s ease-in-out infinite' }}
        />

        {/* Hero content */}
        <div className="relative z-10 text-center px-8 max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary shadow-glow flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-coins text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-br from-accent-primary to-accent-secondary bg-clip-text text-transparent mb-4">
            Finance 360
          </h1>
          <p className="text-text-secondary leading-relaxed text-base">
            Take control of your financial future with powerful tracking, budgeting, and analytics.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {['📊 Analytics', '💰 Budgets', '🎯 Goals', '📈 Insights'].map((f) => (
              <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium bg-bg-tertiary/80 border border-border text-text-secondary">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-bg-secondary">
        <form
          className="w-full max-w-md flex flex-col gap-6 animate-fade-in"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary shadow-glow flex items-center justify-center mx-auto mb-4 lg:hidden">
              <i className="fa-solid fa-coins text-white" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Welcome back</h2>
            <p className="text-sm text-text-muted mt-1">Sign in to your account</p>
          </div>

          {/* Server error */}
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-expense/10 border border-expense/20 text-expense text-sm">
              <i className="fa-solid fa-circle-exclamation flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Fields */}
          <div className="flex flex-col gap-4">
            <Input
              id="login-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="john@example.com"
              error={errors.email}
              required
              icon={<i className="fa-solid fa-envelope" />}
            />
            <Input
              id="login-password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              placeholder="Enter your password"
              error={errors.password}
              required
              icon={<i className="fa-solid fa-lock" />}
            />
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading} size="large">
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin-slow" /> Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <p className="text-center text-sm text-text-muted">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-accent-primary hover:text-accent-primary-hover">
              Create one
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
