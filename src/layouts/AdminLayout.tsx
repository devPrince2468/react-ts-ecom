import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <nav>
        <Link to="/admin">Admin Panel</Link> |{" "}
        <Link to="/admin/users">Users</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
