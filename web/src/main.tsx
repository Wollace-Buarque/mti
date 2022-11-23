import "./styles/global.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";

import { AuthenticateProvider } from "./context/AuthenticateContext";
import { PatientProvider } from "./context/PatientContext";
import { router } from "./Router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthenticateProvider>
      <PatientProvider>
        <Toaster position="top-center" />

        <RouterProvider router={router} />
      </PatientProvider>
    </AuthenticateProvider>
  </React.StrictMode>
)
