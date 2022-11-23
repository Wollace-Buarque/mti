import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import idososSVG from "../assets/idosos.svg";
import Footer from "../components/Footer";
import Header from "../components/Header/Header";
import Medics from "../components/Medics";
import { AuthenticateContext, User } from "../context/AuthenticateContext";
import { server } from "../services/server";
import Loading from "./Loading";

export type Medic = Pick<User, "name" | "avatarUrl" | "medic">;

export default function Main() {
  const { loading, user } = useContext(AuthenticateContext);
  const [medics, setMedics] = useState<Medic[]>();

  document.title = "Início - MTI";

  useEffect(() => {

    server.get("/users").then(response => {
      setMedics(response.data.filter((user: Medic) => user.avatarUrl !== null && user.medic).sort());
    });

  }, []);

  if (loading) {
    return <Loading index />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header index />

      <main className="max-w-5xl mx-auto flex-1 flex flex-col justify-center my-8">

        <Medics medics={medics} />

        <div className="flex flex-col-reverse sm:flex-row gap-7 px-4 sm:px-0 w-full h-full">
          <div className="flex flex-col justify-center items-center sm:items-start text-center sm:text-justify">
            <h2 className="text-title text-4xl font-inter font-bold mb-7 sm:text-left">
              Sua saúde em primeiro lugar!
            </h2>

            <p className="mb-6">
              Com o envelhecimento da população, a chegada de doenças torna-se inevitável, assim, dificultando com seu bem-estar.
              O projeto MTI trata-se disso, um jeito de melhorar a qualidade de vida dos idosos por meio da tecnologia.
            </p>

            <p>
              Buscamos várias formas de melhorar a qualidade de vida dos idosos, como, por exemplo, criar uma rotina saudável, armazenando possíveis
              problemas em um banco de dados, para que sejam enviados para hospitais e formalizar um jeito em ques os resposáveis pelos
              idosos consigam ter um controle maior sobre os possíveis problemas.
            </p>

            <Link
              className="text-button-text bg-button-base text-center rounded-full w-2/5 py-3 mt-6 font-bold hover:brightness-90 transition-[filter] duration-300"
              to={user ? "/account" : "/register"}>
              {user ? "Sua conta" : "Cadastre-se"}
            </Link>
          </div>

          <img
            src={idososSVG}
            title="Imagem de storyset no Freepik"
            width="500"
            height="500"
            draggable={false} />
        </div>
      </main>

      <Footer />
    </div>
  );
}