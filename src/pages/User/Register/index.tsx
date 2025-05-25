import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Register.scss";
import { registerUser } from "../../../redux/Slices/users/userThunks";
import { RootState } from "../../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch =
    useDispatch<typeof import("../../../redux/store").store.dispatch>();
  const { user, loading, error, success } = useSelector((state: RootState) => {
    return state.users as {
      user: { id: string; name: string; email: string } | null;
      loading: boolean;
      error: string | null;
      success: boolean;
    };
  });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [image, setImage] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("password", formData.password);
    if (image) form.append("file", image);
    form.append("role", formData.role);

    dispatch(registerUser(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        console.log("User registered successfully:", res.payload);
        navigate("/login");
        // handleGetProducts();
      } else {
        console.error("Registration failed:", res);
        toast.error("Registration failed. Please try again.");
      }
    });
  };

  // const handleGetProducts = () => {
  //   dispatch(getProducts());
  //   console.log("getProducts dispatched");
  // };

  useEffect(() => {
    if (user && user.id) {
      console.log("User registered successfully:", user);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "USER",
      });
    }
  }, [user]);

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />

        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        <label htmlFor="profileImage">Profile Image</label>
        <input
          type="file"
          id="profileImage"
          accept="image/*"
          onChange={handleFileChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {success && <p className="message">Registration successful!</p>}
        {error && <p className="error">Error: {error}</p>}
      </form>
      <div className="form-footer">
        <p>Already have an account?</p>
        <Link to="/login" className="login-link">
          Sign in here
        </Link>
      </div>
    </div>
  );
};

export default Register;
