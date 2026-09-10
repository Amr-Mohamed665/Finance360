import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { registerUser, clearAuthError } from "../../store/slices/authSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function RegisterPage() {
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  // Form validation
  const validationSchema = Yup.object({
    username: Yup.string()
      .trim()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),

    email: Yup.string()
      .trim()
      .email("Enter a valid email")
      .required("Email is required"),

    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password")], "Passwords do not match"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema,

    onSubmit: async (values) => {
      const result = await dispatch(
        registerUser({
          username: values.username.trim(),
          email: values.email.trim(),
          password: values.password,
        }),
      );

      if (!result.error) {
        setSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    },
  });

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Left — Decoration panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-bg-secondary border-r border-border">
        <div
          className="absolute w-96 h-96 rounded-full opacity-10 -top-24 -left-24 bg-accent-secondary"
          style={{ animation: "float 8s ease-in-out infinite" }}
        />

        <div
          className="absolute w-72 h-72 rounded-full opacity-10 -bottom-16 -right-12 bg-income"
          style={{ animation: "float 6s ease-in-out infinite reverse" }}
        />

        <div
          className="absolute w-48 h-48 rounded-full opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-primary"
          style={{ animation: "float 10s ease-in-out infinite" }}
        />

        <div className="relative z-10 text-center px-8 max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-accent shadow-glow-cyan flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-rocket text-3xl text-white" />
          </div>

          <h1 className="text-4xl font-black bg-gradient-to-br from-accent-secondary to-income bg-clip-text text-transparent mb-4">
            Get Started
          </h1>

          <p className="text-text-secondary leading-relaxed text-base">
            Start your journey to financial freedom. Track, budget, and grow
            your savings today.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {[
              "✅ Free to use",
              "🔒 Secure",
              "📱 Responsive",
              "⚡ Real-time",
            ].map((feature) => (
              <span
                key={feature}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-bg-tertiary/80 border border-border text-text-secondary"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-bg-secondary">
        <form
          className="w-full max-w-md flex flex-col gap-6 animate-fade-in"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-accent shadow-glow-cyan flex items-center justify-center mx-auto mb-4 lg:hidden">
              <i className="fa-solid fa-rocket text-white" />
            </div>

            <h2 className="text-2xl font-bold text-text-primary">
              Create account
            </h2>

            <p className="text-sm text-text-muted mt-1">
              Start managing your finances today
            </p>
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
            {/* Username */}
            <Input
              id="register-username"
              name="username"
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="john123"
              error={
                formik.touched.username && formik.errors.username
                  ? formik.errors.username
                  : ""
              }
              required
              icon={<i className="fa-solid fa-user" />}
            />

            {/* Email */}
            <Input
              id="register-email"
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="john@example.com"
              error={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : ""
              }
              required
              icon={<i className="fa-solid fa-envelope" />}
            />

            {/* Password */}
            <Input
              id="register-password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Minimum 6 characters"
              error={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : ""
              }
              required
              icon={<i className="fa-solid fa-lock" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i
                    className={`fa-solid ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  />
                </button>
              }
            />

            {/* Confirm Password */}
            <Input
              id="register-confirm"
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Repeat your password"
              error={
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? formik.errors.confirmPassword
                  : ""
              }
              required
              icon={<i className="fa-solid fa-lock" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  <i
                    className={`fa-solid ${
                      showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  />
                </button>
              }
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading || success}
            size="large"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin-slow" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-accent-primary hover:text-accent-primary-hover"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
