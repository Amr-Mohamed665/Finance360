import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { updateUserProfile } from "../store/slices/authSlice";
import { getErrorMessage } from "../utils/helpers";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

export default function EditProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = "Username is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Invalid email format";
    }

    if (form.newPassword) {
      if (form.newPassword.length < 6) {
        errs.newPassword = "New password must be at least 6 characters";
      }
      if (form.newPassword !== form.confirmPassword) {
        errs.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSaving(true);
    setSuccessMsg("");

    const updateData = {
      username: form.username.trim(),
      email: form.email.trim(),
    };

    if (form.newPassword) {
      updateData.password = form.newPassword;
    }

    try {
      await dispatch(
        updateUserProfile({
          userId: user?.id || user?.documentId,
          profileData: updateData,
        })
      ).unwrap();

      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 1200);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: getErrorMessage(err, "Failed to update profile"),
      }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl mx-auto w-full">
      {/* Top Breadcrumb/Back & Header */}
      <div>
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-primary transition-colors mb-3"
        >
          <i className="fa-solid fa-arrow-left" /> Back to Profile
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Edit Profile</h1>
        <p className="text-sm text-text-muted mt-1">
          Update your personal details and password
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-income/10 border border-income/30 text-income text-sm flex items-center gap-3 animate-fade-in">
          <i className="fa-solid fa-circle-check text-base" />
          <span>{successMsg}</span>
        </div>
      )}

      {errors.general && (
        <div className="p-4 rounded-xl bg-expense/10 border border-expense/30 text-expense text-sm flex items-center gap-3 animate-fade-in">
          <i className="fa-solid fa-circle-exclamation text-base" />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {/* Basic Information */}
        <Card title="Personal Information">
          <div className="flex flex-col gap-4">
            <Input
              id="edit-username"
              label="Username"
              value={form.username}
              onChange={handleChange("username")}
              placeholder="Your username"
              error={errors.username}
              required
              icon={<i className="fa-solid fa-user" />}
            />

            <Input
              id="edit-email"
              label="Email Address"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
              error={errors.email}
              required
              icon={<i className="fa-solid fa-envelope" />}
            />
          </div>
        </Card>

        {/* Change Password (Optional) */}
        <Card title="Change Password (Optional)">
          <div className="flex flex-col gap-4">
            <p className="text-xs text-text-muted -mt-1">
              Leave blank if you do not wish to change your current password.
            </p>

            <Input
              id="new-password"
              label="New Password"
              type="password"
              value={form.newPassword}
              onChange={handleChange("newPassword")}
              placeholder="Enter new password"
              error={errors.newPassword}
              icon={<i className="fa-solid fa-lock" />}
            />

            <Input
              id="confirm-password"
              label="Confirm New Password"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              placeholder="Confirm new password"
              error={errors.confirmPassword}
              icon={<i className="fa-solid fa-lock" />}
            />
          </div>
        </Card>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link to="/profile">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving || loading}
          >
            {isSaving ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" /> Saving Changes...
              </>
            ) : (
              <>
                <i className="fa-solid fa-check" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
