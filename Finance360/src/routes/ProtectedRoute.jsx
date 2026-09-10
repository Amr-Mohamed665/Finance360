import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, isTokenExpired } from "../store/slices/authSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkTokenStatus = () => {
      const currentToken = localStorage.getItem("token");
      if (currentToken && isTokenExpired(currentToken)) {
        dispatch(logout());
        navigate("/login", { replace: true });
      }
    };

    checkTokenStatus();
    const interval = setInterval(checkTokenStatus, 10000); // Periodically check every 10s
    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  if (!isAuthenticated || (token && isTokenExpired(token))) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
