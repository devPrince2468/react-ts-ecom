import { Navigate, useRoutes } from "react-router-dom";
import Login from "../pages/User/Login";
import Register from "../pages/User/Register";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/Admin/Panel";
import Users from "../pages/Admin/Users";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound/index";
import Products from "../pages/Products";
import Cart from "../pages/Cart";

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        { index: true, element: <Navigate to="/login" replace /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
    },
    {
      path: "/products",
      element: (
        <ProtectedRoute>
          <Products />
        </ProtectedRoute>
      ),
    },
    {
      path: "/cart",
      element: (
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute roles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <AdminPanel /> },
        { path: "users", element: <Users /> },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return routes;
};

export default AppRoutes;
