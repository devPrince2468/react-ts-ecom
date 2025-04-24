// import { JSX } from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
//   const isAuthenticated = !!localStorage.getItem("token");
//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;

// routes/ProtectedRoute.tsx
import { JSX } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  roles = [],
}: {
  children: JSX.Element;
  roles?: string[];
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <Navigate to="/login" />;
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
