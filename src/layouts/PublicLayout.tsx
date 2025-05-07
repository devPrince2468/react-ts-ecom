import { Outlet, Link, useLocation } from "react-router-dom";
import "./PublicLayout.scss";

const PublicLayout = () => {
  const location = useLocation();

  const isActive = (path: string): string => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className="layout public-layout">
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>E-commerce</h1>
          </div>
          <nav className="nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${isActive("/")}`}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className={`nav-link ${isActive("/login")}`}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/register"
                  className={`nav-link ${isActive("/register")}`}
                >
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/products"
                  className={`nav-link ${isActive("/products")}`}
                >
                  Products
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} E-commerce. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
