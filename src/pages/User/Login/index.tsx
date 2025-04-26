import React from "react";
import "./Login.scss";
import { loginUser } from "../../../redux/Slices/users/userThunks";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../../../redux/store";

const Login: React.FC = () => {
  const [userData, setUserData] = React.useState({ email: "", password: "" });

  const dispatch = useDispatch<typeof store.dispatch>();

  const { user, loading, error, success } = useSelector(
    (state: RootState) => state.users
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(userData));
  };

  React.useEffect(() => {
    if (user && user.id) {
      console.log("User logged in successfully:", user);
      setUserData({ email: "", password: "" });
    }
  }, [user]);

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

        <p className="login-footer">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
