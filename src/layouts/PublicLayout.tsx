import { Outlet, Link } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
