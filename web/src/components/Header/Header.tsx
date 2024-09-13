import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

import { AuthenticateContext } from "../../context/AuthenticateContext";
import NavLink from "./NavLink";

export default function Header() {
  const { user } = useContext(AuthenticateContext);
  const { pathname } = useLocation();

  const isHome = pathname === "/";
  const isLogin = pathname === "/login";
  const isRegister = pathname === "/register";
  const isProfile = pathname === "/profile";
  const isAbout = pathname === "/about-us";

  return (
    <header className="h-32 border-b border-line sm:h-16">
      <div className="mx-auto flex h-full max-w-5xl flex-col items-center justify-center sm:flex-row sm:justify-between">
        <Link
          to="/"
          className="mt-7 bg-gradient-to-br from-white to-gray-500 bg-clip-text font-fire text-4xl font-black text-transparent transition-transform duration-300 selection:text-description hover:scale-[1.06] sm:mt-0"
        >
          MTI
        </Link>

        <nav>
          <ul className="flex gap-4">
            <NavLink name="Início" to="/" active={isHome} />

            {!user ? (
              isLogin ? (
                <NavLink name="Entrar" to="/login" active={isLogin} />
              ) : isRegister ? (
                <NavLink name="Cadastrar" to="/register" active={isRegister} />
              ) : (
                <NavLink name="Entrar" to="/login" active={isLogin} />
              )
            ) : (
              <NavLink name="Conta" to="/profile" active={isProfile} />
            )}

            <NavLink name="Sobre" to="/about-us" active={isAbout} />
          </ul>
        </nav>
      </div>
    </header>
  );
}
