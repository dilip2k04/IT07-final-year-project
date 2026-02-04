import { Navigate } from "react-router-dom";
import { getToken, getUser } from "@/lib/auth";

export default function ProtectedRoute({ allowedRoles, children }) {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
