import { Eye, EyeClosed } from "@phosphor-icons/react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoMTI from "../assets/logo.png";
import { Button } from "../components/Button";
import Footer from "../components/Footer";
import FormGroup from "../components/FormGroup";
import Header from "../components/Header/Header";
import { register } from "../services/authentications";
import { showToast } from "../utilities/toast";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  document.title = "Cadastro - MTI";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = new FormData(event.target as HTMLFormElement);

    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");
    const checkPassword = data.get("check-password");

    if (!name || !email || !password || !checkPassword) {
      showToast({ message: "Preencha todos os campos!", type: "warning" });
      return;
    }

    if (
      !name.toString().includes(" ") ||
      name.toString().split(" ").length < 2
    ) {
      showToast({ message: "Preencha o nome completo!", type: "warning" });
      return;
    }

    if (password.toString() !== checkPassword.toString()) {
      showToast({ message: "As senhas não coincidem!", type: "warning" });
      return;
    }

    const response = await register(
      name.toString(),
      email.toString(),
      password.toString(),
    );

    if (!response) {
      showToast({
        message: "Ocorreu um erro ao tentar criar sua conta!",
        type: "error",
      });
      return;
    }

    if (response.message !== "Account created.") {
      showToast({ message: "A conta já existe!", type: "error" });
      return false;
    }

    navigate("/login");
    showToast({ message: "Conta criada com sucesso!" });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header signup />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-between gap-8 py-6 sm:flex-row sm:gap-0 sm:py-0">
        <img src={logoMTI} alt="MTI - O melhor para você" draggable={false} />

        <div className="w-11/12 rounded-lg bg-black/40 p-6 sm:w-2/5">
          <h1 className="mb-6 text-4xl text-title">Cadastro</h1>

          <form onSubmit={handleSubmit}>
            <FormGroup
              name="name"
              title="Nome"
              placeholder="Digite seu nome completo"
            />

            <FormGroup
              className="mt-3"
              name="email"
              title="E-mail"
              placeholder="Digite seu e-mail"
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

            <div className="relative mt-3">
              <FormGroup
                name="check-password"
                title="Confirmar senha"
                placeholder="Digite sua senha novamente"
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

            <Button title="Cadastrar" />
          </form>

          <div className="mt-4 flex flex-col text-sm text-description">
            <p>
              Já possui uma conta?{" "}
              <Link to="/login" className="underline">
                Entre agora
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
