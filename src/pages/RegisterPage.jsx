import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearAuthError } from '../store/slices/authSlice';
import { isValidEmail } from '../utils/helpers';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const result = await dispatch(
        registerUser({ name: form.name, email: form.email, password: form.password })
      );
      if (!result.error) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      }
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
        <div
          className="absolute w-96 h-96 rounded-full opacity-10 -top-24 -left-24 bg-accent-secondary"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
        <div
          className="absolute w-72 h-72 rounded-full opacity-10 -bottom-16 -right-12 bg-income"
          style={{ animation: 'float 6s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute w-48 h-48 rounded-full opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-primary"
          style={{ animation: 'float 10s ease-in-out infinite' }}
        />

        <div className="relative z-10 text-center px-8 max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-accent shadow-glow-cyan flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-rocket text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-br from-accent-secondary to-income bg-clip-text text-transparent mb-4">
            Get Started
          </h1>
          <p className="text-text-secondary leading-relaxed text-base">
            Start your journey to financial freedom. Track, budget, and grow your savings today.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {['✅ Free to use', '🔒 Secure', '📱 Responsive', '⚡ Real-time'].map((f) => (
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
            <div className="w-12 h-12 rounded-xl bg-gradient-accent shadow-glow-cyan flex items-center justify-center mx-auto mb-4 lg:hidden">
              <i className="fa-solid fa-rocket text-white" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Create account</h2>
            <p className="text-sm text-text-muted mt-1">Start managing your finances today</p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-expense/10 border border-expense/20 text-expense text-sm">
              <i className="fa-solid fa-circle-exclamation flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-income/10 border border-income/20 text-income text-sm">
              <i className="fa-solid fa-circle-check flex-shrink-0" />
              Account created! Redirecting to login...
            </div>
          )}

          {/* Fields */}
          <div className="flex flex-col gap-4">
            <Input
              id="register-name"
              label="Full Name"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="John Doe"
              error={errors.name}
              required
              icon={<i className="fa-solid fa-user" />}
            />
            <Input
              id="register-email"
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
              id="register-password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              placeholder="Minimum 6 characters"
              error={errors.password}
              required
              icon={<i className="fa-solid fa-lock" />}
            />
            <Input
              id="register-confirm"
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="Repeat your password"
              error={errors.confirmPassword}
              required
              icon={<i className="fa-solid fa-lock" />}
            />
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading || success} size="large">
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin-slow" /> Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          <p className="text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-accent-primary hover:text-accent-primary-hover">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
