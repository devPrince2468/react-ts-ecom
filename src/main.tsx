import ReactDOM from "react-dom/client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import "./styles/main.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
