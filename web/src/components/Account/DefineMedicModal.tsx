import * as Dialog from "@radix-ui/react-dialog";
import { FormEvent, useContext } from "react";

import userSVG from "../../assets/user.svg";
import { AuthenticateContext } from "../../context/AuthenticateContext";
import { Patient, PatientContext } from "../../context/PatientContext";
import { server } from "../../services/server";
import { showToast } from "../../utilities/toast";
import { Button } from "../Button";

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
      showToast({ message: "Paciente não encontrado!", type: "error" });
      props.setOpen(false);
      return;
    }

    if (!user) {
      showToast({
        message:
          "Erro ao validar sua conta, por favor, tente entrar novamente!",
        type: "error",
      });
      props.setOpen(false);
      return;
    }

    if (user.type !== "admin") {
      showToast({
        message: "Apenas administradores podem definir médicos ou pacientes!",
        type: "error",
      });
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
        showToast({
          message: "Apenas administradores podem definir médicos ou pacientes!",
          type: "error",
        });
        props.setOpen(false);
        return;
      }

      if (data.message !== "Type changed.") {
        showToast({
          message: "Algo deu errado ao tentar alterar o tipo de usuário!",
          type: "error",
        });
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
      showToast({ message });
    } catch (error) {
      showToast({
        message: "Algo deu errado ao tentar alterar o tipo de usuário!",
        type: "error",
      });
    }

    props.setOpen(false);
  }

  if (!patient) return null;

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/60">
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[750px] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#181818] px-10 py-8 text-white shadow-lg shadow-black/25 sm:w-[550px]">
          <Dialog.Title className="mb-6 text-center font-inter text-3xl font-black">
            {patient.type === "patient"
              ? "Definir como médico"
              : "Definir como paciente"}
          </Dialog.Title>

          <Dialog.Description className="mb-5 flex flex-col items-center justify-center gap-4 sm:gap-0">
            <img
              onError={(event) => (event.currentTarget.src = userSVG)}
              className="size-44 rounded-full shadow-image sm:mb-5"
              src={patient.avatarUrl ?? userSVG}
              width={180}
              draggable={false}
            />

            <span className="text-center text-xl text-description sm:text-start">
              {patient.name}
            </span>

            <span className="text-center text-description sm:text-start">
              {patient.email}
            </span>
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Button title="Definir" />

              <Dialog.Close className="mt-4 w-full rounded bg-button-base py-3 text-center font-semibold text-button-text transition-[filter] duration-300 hover:brightness-90">
                Cancelar
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  );
}
