import * as Dialog from "@radix-ui/react-dialog";
import { FormEvent, useContext } from "react";

import userSVG from "../../assets/user.svg";
import { AuthenticateContext } from "../../context/AuthenticateContext";
import { Patient, PatientContext } from "../../context/PatientContext";
import { server } from "../../services/server";
import { clockFormatter } from "../../utilities/clockFormatter";
import { showToast } from "../../utilities/toast";
import { Button } from "../Button";
import FormGroup from "../FormGroup";

interface CreateActivityModalProps {
  patients: Patient[];
  setPatients: (value: Patient[]) => void;
  setOpen: (value: boolean) => void;
}

export default function CreateActivityModal(props: CreateActivityModalProps) {
  const { user } = useContext(AuthenticateContext);
  const { patient } = useContext(PatientContext);

  if (!patient) return null;

  const activities = patient.activities?.length ?? 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!patient) {
      showToast({ message: "Paciente não encontrado!", type: "error" });
      return;
    }

    if (!patient.report) {
      showToast({
        message: `${patient.name.split(" ")[0]} não enviou o laudo médico!`,
        type: "error",
      });
      return;
    }

    const data = new FormData(event.target as HTMLFormElement);

    const activity = data.get("activity");
    const duration = clockFormatter(data.get("duration")?.toString() ?? "");
    const description = data.get("description");

    if (!activity || !duration || !description) {
      showToast({ message: "Preencha todos os campos!", type: "warning" });
      return;
    }

    if (duration < 1) {
      showToast({ message: "Duração inválida!", type: "warning" });
      return;
    }

    if (!user) {
      showToast({
        message: "Erro ao validar sua conta, tente reentrar!",
        type: "error",
      });
      props.setOpen(false);
      return;
    }

    if (user.type !== "medic") {
      showToast({
        message: "Apenas médicos podem adicionar atividades a pacientes",
        type: "error",
      });
      props.setOpen(false);
      return;
    }

    try {
      const { data } = await server.post("/activity", {
        name: activity,
        duration,
        description,
        authorEmail: user.email,
        patientEmail: patient.email,
      });

      const newPatient = patient;

      newPatient.activities?.push({
        id: data.activityId,
        name: activity.toString(),
        duration,
        description: description.toString(),
        author: user,
        createadAt: new Date(),
        updatedAt: new Date(),
      });

      props.setPatients(
        props.patients.map((p) => (p.email === patient.email ? newPatient : p)),
      );

      showToast({
        message: "Atividade adicionada com sucesso!",
      });
    } catch (error) {
      showToast({
        message: "Algo deu errado ao tentar adicionar a atividade!",
        type: "error",
      });
    }

    props.setOpen(false);
  }

  function handleBeforeInput(event: any) {
    if (!event.data || event.data.match("[0-9]")) return;

    if (event.data == ":" && event.target.value.split(":").length < 3) return;

    event.preventDefault();
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/60">
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[750px] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#181818] px-10 py-8 text-white shadow-lg shadow-black/25 sm:max-w-xl">
          <Dialog.Title className="mb-6 text-center font-inter text-3xl font-black">
            Adicionar atividade
          </Dialog.Title>

          <Dialog.Description className="mb-5 flex flex-col items-center justify-center gap-4 sm:mb-0 sm:flex-row">
            <img
              onError={(event) => (event.currentTarget.src = userSVG)}
              className="size-44 rounded-full shadow-image sm:mb-5"
              src={patient.avatarUrl ?? userSVG}
              width={180}
              draggable={false}
            />

            <div className="flex flex-col text-center text-description sm:text-start">
              <span className="text-xl">{patient.name}</span>
              <span>
                {activities} atividade{activities !== 1 && "s"}
              </span>
            </div>
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <FormGroup
              name="activity"
              title="Atividade"
              placeholder="Nome do exercício"
            />

            <div className="flex flex-col text-sm font-semibold uppercase">
              <label htmlFor="duration">Duração</label>

              <input
                className="rounded-sm bg-[#252222] p-2 font-normal text-text placeholder-text placeholder:text-sm focus:outline focus:outline-1 focus:outline-button-base"
                onBeforeInput={handleBeforeInput}
                type="text"
                name="duration"
                id="duration"
                title="Exemplo de duração: 00:00:00"
                placeholder="Duração do exercício"
              />
            </div>

            <FormGroup
              name="description"
              title="Descrição"
              placeholder="Descrição do exercício"
              textarea
            />

            <div className="flex gap-2">
              <Button title="Adicionar" />

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
