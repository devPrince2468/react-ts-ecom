import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/User/register.user";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/Admin/Panel";
import Users from "../pages/Admin/Users";
import NotFound from "../pages/NotFound";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import { useRoutes } from "react-router-dom";

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        { path: "", element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
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
      element: (
        <h1>
          <NotFound />
        </h1>
      ),
    },
  ]);

  return routes;
};

export default AppRoutes;
