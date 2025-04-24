import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import { registerUser } from "../../features/users/userThunks";
import { getProducts } from "../../features/products/productThunks";
import "./Register.scss";

const Register = () => {
  const dispatch = useDispatch<typeof import("../../store").store.dispatch>();
  const { loading, error, success } = useSelector((state: RootState) => {
    return state.users as {
      loading: boolean;
      error: string | null;
      success: boolean;
    };
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    dispatch(registerUser(form));
  };

  const handleGetProducts = () => {
    dispatch(getProducts());
    console.log("getProducts dispatched");
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <input name="name" onChange={handleChange} placeholder="Name" />
        <input name="email" onChange={handleChange} placeholder="Email" />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Password"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {success && <p className="message">Registration successful!</p>}
        {error && <p className="error">Error: {error}</p>}
      </form>

      {/* <button className="get-products-btn" onClick={handleGetProducts}>
        getProducts
      </button> */}
    </div>
  );
};

export default Register;
