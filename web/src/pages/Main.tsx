import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import idososSVG from "../assets/idosos.svg";
import Footer from "../components/Footer";
import Header from "../components/Header/Header";
import Medics from "../components/Medics";
import { AuthenticateContext, User } from "../context/AuthenticateContext";
import { server } from "../services/server";
import Loading from "./Loading";

export type Medic = Pick<User, "name" | "avatarUrl" | "type">;

export default function Main() {
  const { loading, user } = useContext(AuthenticateContext);
  const [medics, setMedics] = useState<Medic[]>();

  document.title = "Início - MTI";

  useEffect(() => {
    server.get("/users").then((response) => {
      setMedics(
        response.data
          .filter(
            (user: Medic) => user.avatarUrl !== null && user.type === "medic",
          )
          .sort(),
      );
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header index />

      <main className="mx-auto my-8 flex max-w-5xl flex-1 flex-col justify-center">
        <Medics medics={medics} />

        <div className="flex h-full w-full flex-col-reverse gap-7 px-4 sm:flex-row sm:px-0">
          <div className="flex flex-col items-center justify-center text-center sm:items-start sm:text-justify">
            <h2 className="mb-7 font-inter text-4xl font-bold text-title sm:text-left">
              Sua saúde em primeiro lugar!
            </h2>

            <p className="mb-6">
              Com o envelhecimento da população, a chegada de doenças torna-se
              inevitável, assim, dificultando com seu bem-estar. O projeto MTI
              trata-se disso, um jeito de melhorar a qualidade de vida dos
              idosos por meio da tecnologia.
            </p>

            <p>
              Buscamos várias formas de melhorar a qualidade de vida dos idosos,
              como, por exemplo, criar uma rotina saudável, armazenando
              possíveis problemas em um banco de dados, para que sejam enviados
              para hospitais e formalizar um jeito em ques os resposáveis pelos
              idosos consigam ter um controle maior sobre os possíveis
              problemas.
            </p>

            <Link
              className="mt-6 w-2/5 rounded-full bg-button-base py-3 text-center font-bold text-button-text transition-[filter] duration-300 hover:brightness-90"
              to={user ? "/account" : "/register"}
            >
              {user ? "Sua conta" : "Cadastre-se"}
            </Link>
          </div>

          <img
            src={idososSVG}
            title="Imagem de storyset no Freepik"
            width="500"
            height="500"
            draggable={false}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
