import { FormEvent, useContext } from "react";

import * as Dialog from "@radix-ui/react-dialog";

import userSVG from "../../assets/user.svg";
import { AuthenticateContext } from "../../context/AuthenticateContext";
import { Patient, PatientContext } from "../../context/PatientContext";
import { server } from "../../services/server";
import showToast from "../../utilities/toast";
import Button from "../Button";

interface DefineMedicModalProps {
  patients: Patient[];
  setPatients: (value: Patient[]) => void;
  setOpen: (value: boolean) => void;
}

export default function DefineMedicModal(props: DefineMedicModalProps) {
  const { user } = useContext(AuthenticateContext);
  const { patient } = useContext(PatientContext);

  if (!patient) {
    return null;
  }

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

    try {
      const { data } = await server.post("/type", {
        adminEmail: user.email,
        patientEmail: patient.email,
        type: patient.type === "medic" ? "patient" : "medic"
      });

      if (data.message === "User is not an admin.") {
        showToast("Apenas administradores podem adicionar ou remover novos médicos!", 500);
        props.setOpen(false);
        return;
      }

      if (data.message !== "Type changed.") {
        showToast("Erro ao definir médico ou remover, por favor, tente novamente!", 500);
        props.setOpen(false);
        return;
      }

      const newType = patient.type === "medic" ? "patient" : "medic";

      props.setPatients(props.patients.map(p => p.email === patient.email ? { ...p, type: newType } : p));

      if (patient.type === "medic") {
        showToast("Médico removido com sucesso!", 500);
      } else {
        showToast("Médico definido com sucesso!", 500);
      }

    } catch (error) {
      showToast("Erro ao definir ou remover médico, atualize a página e tente novamente!", 500);
    }

    props.setOpen(false);
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed">

        <Dialog.Content className="bg-[#181818] fixed py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 
  -translate-y-1/2 rounded-lg w-[95%] sm:w-[550px] max-h-[750px] shadow-lg shadow-black/25">

          <Dialog.Title className="text-3xl text-center font-inter font-black mb-6">
            {patient.type === "patient" ? "Definir como médico" : "Definir como paciente"}
          </Dialog.Title>

          <div className="flex flex-col justify-center items-center gap-4 sm:gap-0 mb-5">
            <img
              onError={event => event.currentTarget.src = userSVG}
              className="max-w-[180px] max-h-[180px] min-w-[180px] min-h-[180px] rounded-full shadow-image sm:mb-5"
              src={patient.avatarUrl ?? userSVG}
              width={180} draggable={false} />

            <span className="text-xl text-description text-center sm:text-start">
              {patient.name}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            <div className="flex gap-2">
              <Button title="Definir" />

              <Dialog.Close asChild>
                <Button title="Cancelar" />
              </Dialog.Close>
            </div>
          </form>

        </Dialog.Content>

      </Dialog.Overlay>
    </Dialog.Portal>
  )
}