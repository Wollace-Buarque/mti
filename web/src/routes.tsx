import { createBrowserRouter } from "react-router-dom";

import About from "./pages/About";
import Account from "./pages/Account";
import Activities from "./pages/Activities";
import Main from "./pages/Main";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { AppLayout } from "./pages/_layouts/app";
import { AuthLayout } from "./pages/_layouts/auth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        index: true,
        element: <Main />,
      },
      {
        path: "/about-us",
        element: <About />,
      },
      {
        path: "/profile",
        element: <Account />,
      },
      {
        path: "/patient/:id",
        element: <Activities />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <SignIn />,
      },
      {
        path: "/register",
        element: <SignUp />,
      },
    ],
  },
]);
