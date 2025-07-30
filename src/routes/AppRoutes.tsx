import { Navigate, useRoutes } from "react-router-dom";
import Login from "../pages/User/Login";
import Register from "../pages/User/Register";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/Admin/Panel";
import Users from "../pages/Admin/Users";
import AdminProducts from "../pages/Admin/Products";
import AdminOrders from "../pages/Admin/Orders";
import AdminPayments from "../pages/Admin/Payments";
import AdminReports from "../pages/Admin/Reports";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound/index";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import Profile from "../pages/User/Profile/Index";
import UserOrders from "../pages/User/Orders";

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        { index: true, element: <Navigate to="/login" replace /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        {
          path: "products",
          element: (
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          ),
        },
        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "orders",
          element: (
            <ProtectedRoute>
              <UserOrders />
            </ProtectedRoute>
          ),
        },
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
        <ProtectedRoute roles={["ADMIN"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <AdminPanel /> },
        { path: "users", element: <Users /> },
        { path: "products", element: <AdminProducts /> },
        { path: "orders", element: <AdminOrders /> },
        { path: "payments", element: <AdminPayments /> },
        { path: "reports", element: <AdminReports /> },
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
