import { Eye, EyeClosed } from "@phosphor-icons/react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/Button";
import Footer from "../components/Footer";
import FormGroup from "../components/FormGroup";
import Header from "../components/Header/Header";
import{ showToast } from "../utilities/toast";
import { register } from "../services/authentications";

import logoMTI from "../assets/logo.png";

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
      showToast("Preencha todos os campos!");
      return;
    }

    if (
      !name.toString().includes(" ") ||
      name.toString().split(" ").length < 2
    ) {
      showToast("Preencha o nome completo!");
      return;
    }

    if (password.toString() !== checkPassword.toString()) {
      showToast("As senhas precisam ser iguais!");
      return;
    }

    const response = await register(
      name.toString(),
      email.toString(),
      password.toString(),
    );

    if (!response) {
      showToast("Ocorreu um erro ao tentar criar sua conta!");
      return;
    }

    if (response.message !== "Account created.") {
      showToast("A conta já existe!");
      return false;
    }

    navigate("/login");
    showToast("Conta cadastrada com sucesso!");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header signup />

      <main className="max-w-5xl mx-auto w-full flex flex-col gap-8 sm:gap-0 sm:flex-row items-center justify-between flex-1 py-6 sm:py-0">
        <img src={logoMTI} alt="MTI - O melhor para você" draggable={false} />

        <div className="w-11/12 sm:w-2/5 bg-black/40 p-6 rounded-lg">
          <h1 className="text-4xl text-title mb-6">Cadastro</h1>

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

          <div className="flex flex-col mt-4 text-sm text-description">
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
