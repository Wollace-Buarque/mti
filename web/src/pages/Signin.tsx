import { Eye, EyeClosed } from "phosphor-react";
import { FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoMTI from "../assets/logo.png";
import Button from "../components/Button";
import Footer from "../components/Footer";
import FormGroup from "../components/FormGroup";
import Header from "../components/Header/Header";
import { AuthenticateContext } from "../context/AuthenticateContext";
import { login } from "../services/authentications";
import showToast from "../utilities/toast";
import Loading from "./Loading";

export default function Signin() {
  const { loading, setUser } = useContext(AuthenticateContext);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  document.title = "Entrar - MTI";

  if (loading) {
    return <Loading login />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = new FormData(event.target as HTMLFormElement);

    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) {
      showToast("Preencha todos os campos!");
      return;
    }

    const response = await login(email.toString(), password.toString());

    if (!response) {
      showToast("Ocorreu um erro ao tentar entrar!")
      return;
    }

    if (response.message !== "Logged in.") {
      showToast("E-mail ou senha inválido!")
      return;
    }

    setUser({
      id: response.id,
      name: response.name,
      email: response.email,
      token: response.token,
      medic: response.medic,
      report: response.report,
      avatarUrl: response.avatarUrl,
      createdAt: new Date(response.createdAt),
      activities: response.activities
    });

    localStorage.setItem("token", response.token);

    navigate("/account");
    showToast("Login realizado com sucesso!", 500);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header login />

      <main className="max-w-5xl mx-auto w-full flex flex-col gap-8 sm:gap-0 sm:flex-row items-center justify-between flex-1 py-6 sm:py-0">

        <img src={logoMTI} alt="MTI - O melhor para você" draggable={false} />

        <div className="w-11/12 sm:w-2/5 bg-black/40 p-6 rounded-lg">
          <h1 className="text-4xl text-title mb-6">
            Entrar
          </h1>

          <form onSubmit={handleSubmit}>
            <FormGroup
              name="email"
              title="E-mail"
              placeholder="Digite seu e-mail"
              type="email" />

            <div className="relative mt-3">
              <FormGroup
                name="password"
                title="Senha"
                placeholder="Digite sua senha"
                type={showPassword ? "text" : "password"} />

              <button
                title="Mostrar senha"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                className="absolute bottom-2 right-2">

                {showPassword
                  ? <Eye size={20} color="#EBA417" />
                  : <EyeClosed size={20} color="#EBA417" />}

              </button>
            </div>

            <Button title="Entrar" />
          </form>

          <div className="flex flex-col mt-4 text-sm text-description">
            <a className="underline" href="#">Esqueceu sua senha?</a>

            <div>
              Não possui uma conta? <Link to="/register" className="underline">Cadastre-se gratuitamente</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}