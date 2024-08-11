import { FormEvent, useContext } from "react";

import * as Dialog from "@radix-ui/react-dialog";

import { AuthenticateContext } from "../../context/AuthenticateContext";
import { Patient, PatientContext } from "../../context/PatientContext";
import { server } from "../../services/server";

import{ showToast } from "../../utilities/toast";
import Button from "../Button";

import userSVG from "../../assets/user.svg";

interface DefineMedicModalProps {
  patients: Patient[];
  setPatients: (value: Patient[]) => void;
  setOpen: (value: boolean) => void;
}

export default function DefineMedicModal(props: DefineMedicModalProps) {
  const { user } = useContext(AuthenticateContext);
  const { patient } = useContext(PatientContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!patient) {
      showToast("Paciente não encontrado!", 500);
      props.setOpen(false);
      return;
    }

    if (!user) {
      showToast("Erro ao validar sua conta, por favor, tente novamente!", 500);
      props.setOpen(false);
      return;
    }

    if (user.type !== "admin") {
      showToast("Apenas administradores podem adicionar novos médicos!", 500);
      props.setOpen(false);
      return;
    }

    const newType = patient.type === "medic" ? "patient" : "medic";

    try {
      const { data } = await server.post("/type", {
        adminEmail: user.email,
        patientEmail: patient.email,
        newType,
      });

      if (data.message === "User is not an admin.") {
        showToast(
          "Apenas administradores podem adicionar ou remover novos médicos!",
          500,
        );
        props.setOpen(false);
        return;
      }

      if (data.message !== "Type changed.") {
        showToast(
          "Erro ao definir médico ou remover, por favor, tente novamente!",
          500,
        );
        props.setOpen(false);
        return;
      }

      props.setPatients(
        props.patients.map((p) =>
          p.email === patient.email ? { ...p, type: newType } : p,
        ),
      );

      const message =
        patient.type === "medic"
          ? "Usuário definido como paciente!"
          : "Usuário definido como médico!";
      showToast(message, 500);
    } catch (error) {
      showToast(
        "Erro ao definir ou remover médico, atualize a página e tente novamente!",
        500,
      );
    }

    props.setOpen(false);
  }

  if (!patient) return null;

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed">
        <Dialog.Content className="bg-[#181818] fixed py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[95%] sm:w-[550px] max-h-[750px] shadow-lg shadow-black/25">
          <Dialog.Title className="text-3xl text-center font-inter font-black mb-6">
            {patient.type === "patient"
              ? "Definir como médico"
              : "Definir como paciente"}
          </Dialog.Title>

          <div className="flex flex-col justify-center items-center gap-4 sm:gap-0 mb-5">
            <img
              onError={(event) => (event.currentTarget.src = userSVG)}
              className="size-44 rounded-full shadow-image sm:mb-5"
              src={patient.avatarUrl ?? userSVG}
              width={180}
              draggable={false}
            />

            <span className="text-xl text-description text-center sm:text-start">
              {patient.name}
            </span>

            <span className="text-description text-center sm:text-start">
              {patient.email}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Button title="Definir" />

              <Dialog.Close className="text-button-text bg-button-base text-center rounded w-full py-3 mt-4 font-semibold hover:brightness-90 transition-[filter] duration-300">
                Cancelar
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  );
}
