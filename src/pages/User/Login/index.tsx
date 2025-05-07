import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Login.scss";
import { loginUser } from "../../../redux/Slices/users/userThunks";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../../../redux/store";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [userData, setUserData] = React.useState({ email: "", password: "" });

  const dispatch = useDispatch<typeof store.dispatch>();
  const navigate = useNavigate();

  const { user, loading, error, success } = useSelector(
    (state: RootState) => state.users
  );

  React.useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/products");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(userData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        console.log("User logged in successfully:", res.payload);
        setUserData({ email: "", password: "" });
        navigate("/products");
      } else {
        console.error("Login failed:", res);
        toast.error("Login failed. Please check your credentials.");
      }
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>

        <div className="form-footer">
          <p>Already have an account?</p>
          <Link to="/register" className="login-link">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
