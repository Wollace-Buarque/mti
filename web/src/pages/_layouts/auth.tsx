import { Outlet } from "react-router-dom";

import Header from "../../components/Header/Header";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto my-10 flex w-full max-w-5xl flex-1 flex-col items-center gap-20 sm:flex-row sm:justify-between sm:gap-0 sm:py-0">
        <Outlet />
      </main>
    </div>
  );
}
