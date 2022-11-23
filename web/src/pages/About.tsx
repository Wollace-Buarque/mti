import { useContext } from "react";

import idososSVG from "../assets/idosos-2.svg";
import idosos2SVG from "../assets/idosos-3.svg";
import Footer from "../components/Footer";
import Header from "../components/Header/Header";
import { AuthenticateContext } from "../context/AuthenticateContext";
import Loading from "./Loading";

export default function About() {
  const { loading } = useContext(AuthenticateContext);

  document.title = "Sobre - MTI";

  if (loading) {
    return <Loading about />
  }

  return (
    <>
      <Header about />

      <main className="max-w-5xl mx-auto my-8">
        <div className="flex flex-col justify-center items-center gap-16 sm:gap-6">

          <div className="flex flex-col sm:flex-row items-center flex-1 gap-2 sm:even:flex-row-reverse">
            <img
              src={idososSVG}
              width={500} height={400}
              title="Imagem de storyset no Freepik"
              draggable={false} />

            <div className="text-description text-center sm:text-justify px-6 sm:px-0 flex flex-col gap-3">
              <h3 className="text-3xl font-inter font-semibold mb-2 text-title sm:text-start">
                Sobre nós
              </h3>

              <p>
                O MTI é um projeto que visa a saúde dos idosos, buscando auxiliar de forma rápida e prática as necessidades
                decorrentes que muitas pessoas da terceira idade têm dificuldade de planejar e realizar algumas tarefas.  
              </p>

              <p>
                Esse projeto é dirigido principalmente para as pessoas de idade avançada, mas não deixa de ser útil para
                aqueles que se interessam no nosso planejamento. Com o propósito de melhorar a saúde e o bem-estar, oferecemos nossos
                serviços de maneira simples e prática, para que todos possam usufruir de tudo que temos a oferecer!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center flex-1 gap-2 sm:even:flex-row-reverse">
            <img
              src={idosos2SVG}
              width={500} height={400}
              title="Imagem de storyset no Freepik"
              draggable={false} />

            <div className="text-description text-center sm:text-justify px-6 sm:px-0 flex flex-col gap-3">
              <h3 className="text-3xl font-inter font-semibold mb-2 text-title sm:text-start">
                Como trabalhamos?
              </h3>

              <p>
                Buscamos oferecer serviços afim de melhorar a qualidade de vida que todos desejam, entre eles oferecemos:
              </p>

              <p>
                Uma rotina saudável: Visando criar uma rotina de exercícios e uma dieta para melhorar a qualidade de vida dos idosos.              
              </p>

              <p>
                Diagnósticos: Um espaço para o registro de problemas médicos, enviados para os hospitais.            
              </p>
              <p>
                Auxílio emergencial: Para que em casos de emergências, o Responsável possa contatar o hospital mais próximo da sua localização.
              </p>

              <p>
                Um suporte ao usuário para que possam relatar problemas com o site ou sugerir para que algo possa ser melhorado.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}