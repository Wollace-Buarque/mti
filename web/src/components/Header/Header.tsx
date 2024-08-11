import { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthenticateContext } from "../../context/AuthenticateContext";
import NavLink from "./NavLink";

interface HeaderProps {
  index?: boolean;
  signin?: boolean;
  signup?: boolean;
  about?: boolean;
  account?: boolean;
}

export default function Header(props: HeaderProps) {
  const { user } = useContext(AuthenticateContext);

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
            <NavLink name="Início" to="/" active={props.index} />

            {!user ? (
              props.signin ? (
                <NavLink name="Entrar" to="/login" active={props.signin} />
              ) : props.signup ? (
                <NavLink name="Cadastrar" to="/signup" active={props.signup} />
              ) : (
                <NavLink name="Entrar" to="/login" active={props.signin} />
              )
            ) : (
              <NavLink name="Conta" to="/account" active={props.account} />
            )}

            <NavLink name="Sobre" to="/about" active={props.about} />

            {/* <li className="relative group">
              <a href="#">Mais</a>

              <ul className="flex flex-col absolute invisible top-6 p-1 min-w-[11.7rem] rounded border-t-2 border-b-2 border-button-base bg-[#252727] transition-all duration-500 group-hover:visible">
                <li><a className="flex flex-1 py-2 px-4 hover:bg-black/20" href="#">Suporte</a></li>
                <li><a className="flex flex-1 py-2 px-4 hover:bg-black/20" href="#">Diagnósticos</a></li>
                <li><a className="flex flex-1 py-2 px-4 hover:bg-black/20" href="#">Rotina saudável</a></li>
                <li><a className="flex flex-1 py-2 px-4 hover:bg-black/20" href="#">Auxílio emergêncial</a></li>
              </ul>
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
}
