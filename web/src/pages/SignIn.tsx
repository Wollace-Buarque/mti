import { Eye, EyeClosed } from "@phosphor-icons/react";
import { FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoMTI from "../assets/logo.png";
import { Button } from "../components/Button";
import Footer from "../components/Footer";
import FormGroup from "../components/FormGroup";
import Header from "../components/Header/Header";
import { AuthenticateContext } from "../context/AuthenticateContext";
import { login } from "../services/authentications";
import { showToast } from "../utilities/toast";
import { server } from "../services/server";

export default function SignIn() {
  const { setUser } = useContext(AuthenticateContext);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  document.title = "Entrar - MTI";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    const data = new FormData(event.target as HTMLFormElement);

    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) {
      showToast({ message: "Preencha todos os campos!", type: "warning" });
      setIsSubmitting(false);
      return;
    }

    const response = await login(email.toString(), password.toString());

    if (!response) {
      showToast({
        message: "Ocorreu um erro ao tentar entrar!",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    if (response.message !== "Logged in.") {
      showToast({ message: "E-mail ou senha inválido!", type: "error" });
      setIsSubmitting(false);
      return;
    }

    setUser({
      id: response.id,
      name: response.name,
      email: response.email,
      token: response.token,
      type: response.type,
      report: response.report,
      avatarUrl: response.avatarUrl,
      createdAt: new Date(response.createdAt),
      activities: response.activities,
    });

    localStorage.setItem("token", response.token);
    server.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;

    navigate("/account");
    showToast({ message: "Login realizado com sucesso!" });

    setIsSubmitting(false);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header signin />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center sm:justify-between gap-20 my-10 sm:flex-row sm:gap-0 sm:py-0">
        <img src={logoMTI} alt="MTI - O melhor para você" draggable={false} />

        <div className="w-11/12 rounded-lg bg-black/40 p-6 sm:w-2/5">
          <h1 className="mb-6 text-4xl text-title">Entrar</h1>

          <form onSubmit={handleSubmit}>
            <FormGroup
              name="email"
              title="E-mail"
              placeholder="Digite seu e-mail"
              type="email"
            />

            <div className="relative mt-3">
              <FormGroup
                name="password"
                title="Senha"
                placeholder="Digite sua senha"
                type={showPassword ? "text" : "password"}
              />

              <button
                title="Mostrar senha"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                className="absolute bottom-2 right-2"
              >
                {showPassword ? (
                  <Eye size={20} color="#EBA417" />
                ) : (
                  <EyeClosed size={20} color="#EBA417" />
                )}
              </button>
            </div>

            <Button className="mt-4" isLoading={isSubmitting}>
              Entrar
            </Button>
          </form>

          <div className="mt-4 flex flex-col text-sm text-description">
            <a className="underline" href="#">
              Esqueceu sua senha?
            </a>

            <div>
              Não possui uma conta?{" "}
              <Link to="/register" className="underline">
                Cadastre-se gratuitamente
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
