import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearAuthError } from '../store/slices/authSlice';
import { isValidEmail } from '../utils/helpers';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './AuthPages.css';

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
        registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
        })
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
            Start your journey to financial freedom. Track, budget, and grow your savings.
          </p>
        </div>
      </div>

      <div className="auth-page__form-section">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form__header">
            <h2 className="auth-form__title">Create account</h2>
            <p className="auth-form__subtitle">Start managing your finances today</p>
          </div>

          {error && <div className="auth-form__error">{error}</div>}
          {success && (
            <div className="auth-form__success">
              Account created successfully! Redirecting to login...
            </div>
          )}

          <div className="auth-form__fields">
            <Input
              id="register-name"
              label="Full Name"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="John Doe"
              error={errors.name}
              required
              icon={<i className="fa-solid fa-user"></i>}
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
              icon={<i className="fa-solid fa-envelope"></i>}
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
              icon={<i className="fa-solid fa-lock"></i>}
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
              icon={<i className="fa-solid fa-lock"></i>}
            />
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading || success} size="large">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>

          <p className="auth-form__footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-form__link">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
