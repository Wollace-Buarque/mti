import { useContext } from "react";
import {
    createBrowserRouter, createRoutesFromElements, Navigate, Route, useLocation
} from "react-router-dom";

import { AuthenticateContext } from "./context/AuthenticateContext";
import About from "./pages/About";
import Account from "./pages/Account";
import Activities from "./pages/Activities";
import Main from "./pages/Main";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

const Protect = ({ children }: any) => {
  const { user } = useContext(AuthenticateContext);
  const location = useLocation();

  if (!user && (location.pathname !== "/login" && location.pathname !== "/register")) {
    return <Navigate to="/login" />;
  }

  if (user && (location.pathname !== "/account")) {
    return <Navigate to="/account" />;
  }

  return children;
};

export const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={
      <Main />
    } />,
    <Route path="/about" element={
      <About />
    } />,
    <Route path="/login" element={
      <Protect>
        <Signin />
      </Protect>
    } />,
    <Route path="/register" element={
      <Protect>
        <Signup />
      </Protect>
    } />,
    <Route path="/account" element={
      <Protect>
        <Account />
      </Protect>
    } />,
    <Route path="/patient/:id" element={
      <Activities />
    } />,
  ])
)