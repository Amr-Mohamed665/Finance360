import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearAuthError } from '../store/slices/authSlice';
import { isValidEmail } from '../utils/helpers';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './AuthPages.css';

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
    <div className="auth-page">
      <div className="auth-page__decoration">
        <div className="auth-page__shapes">
          <div className="shape shape--1"></div>
          <div className="shape shape--2"></div>
          <div className="shape shape--3"></div>
        </div>
        <div className="auth-page__hero">
          <span className="auth-page__hero-icon"><i className="fa-solid fa-coins"></i></span>
          <h1 className="auth-page__hero-title">Finance 360</h1>
          <p className="auth-page__hero-text">
            Take control of your financial future with powerful tracking, budgeting, and analytics.
          </p>
        </div>
      </div>

      <div className="auth-page__form-section">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form__header">
            <h2 className="auth-form__title">Welcome back</h2>
            <p className="auth-form__subtitle">Sign in to your account</p>
          </div>

          {error && <div className="auth-form__error">{error}</div>}

          <div className="auth-form__fields">
            <Input
              id="login-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="john@example.com"
              error={errors.email}
              required
              icon={<i className="fa-solid fa-envelope"></i>}
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
              icon={<i className="fa-solid fa-lock"></i>}
            />
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading} size="large">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="auth-form__footer">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="auth-form__link">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
