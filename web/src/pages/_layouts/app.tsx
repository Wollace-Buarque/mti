import { isAxiosError } from "axios";
import { useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Footer from "../../components/Footer";
import Header from "../../components/Header/Header";
import { api } from "../../services/api";

export function AppLayout() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;
          const code = error.response?.data.code;

          if (status === 401 && code === "UNAUTHORIZED") {
            navigate("/sign-in", {
              replace: true,
            });
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto my-8 flex w-full max-w-5xl flex-1 flex-col px-6 sm:px-0">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
