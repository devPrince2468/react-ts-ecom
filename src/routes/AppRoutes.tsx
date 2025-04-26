import Login from "../pages/User/Login";
import Register from "../pages/User/Register";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/Admin/Panel";
import Users from "../pages/Admin/Users";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import { useRoutes } from "react-router-dom";
import Home from "../pages/Home/Index";
import NotFound from "../pages/NotFound/Index";
import Products from "../pages/Products";

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        { path: "", element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "products", element: <Products /> },
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
      element: <NotFound />,
    },
  ]);

  return routes;
};

export default AppRoutes;
