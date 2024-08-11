import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import { router } from "./Router";
import { AuthenticateProvider } from "./context/AuthenticateContext";
import { PatientProvider } from "./context/PatientContext";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthenticateProvider>
      <PatientProvider>
        <Toaster position="top-center" richColors theme="system" />

        <RouterProvider router={router} />
      </PatientProvider>
    </AuthenticateProvider>
  </React.StrictMode>,
);
