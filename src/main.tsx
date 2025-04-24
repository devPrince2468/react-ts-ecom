import ReactDOM from "react-dom/client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import "./styles/main.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
