import { JSX } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

// Helper function to decode JWT token
const decodeToken = (token: string) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const ProtectedRoute = ({
  children,
  roles = [],
}: {
  children: JSX.Element;
  roles?: string[];
}) => {
  const cookieToken = Cookies.get("token");
  const sessionToken = sessionStorage.getItem("token");
  const token = cookieToken || sessionToken || "";

  if (!token) {
    console.error("No token found in cookies or session storage");
  }

  // If the token exists, decode it
  const user = token ? decodeToken(token) : null;
  console.log("user:", user);

  // If there's no valid user or token, redirect to login page
  if (!user) return <Navigate to="/login" />;

  // Optionally check if the user has the required role
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
