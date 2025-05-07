import { Outlet, Link, useLocation } from "react-router-dom";
import "./AdminLayout.scss";

const AdminLayout = () => {
  const location = useLocation();

  const isActive = (path: string): string => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className="layout admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            <li className="sidebar-nav-item">
              <Link
                to="/admin"
                className={`sidebar-nav-link ${isActive("/admin")}`}
              >
                Dashboard
              </Link>
            </li>
            <li className="sidebar-nav-item">
              <Link
                to="/admin/users"
                className={`sidebar-nav-link ${isActive("/admin/users")}`}
              >
                Users
              </Link>
            </li>
            <li className="sidebar-nav-item">
              <Link to="/dashboard" className="sidebar-nav-link">
                Back to App
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="admin-content">
        <header className="admin-header">
          <div className="container">
            <h1>Admin Area</h1>
            <div className="admin-user">
              <span>Admin User</span>
            </div>
          </div>
        </header>
        <main className="admin-main">
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
