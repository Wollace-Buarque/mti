import { FormEvent, useContext } from "react";

import * as Dialog from "@radix-ui/react-dialog";

import userSVG from "../../assets/user.svg";
import { AuthenticateContext } from "../../context/AuthenticateContext";
import { Patient, PatientContext } from "../../context/PatientContext";
import { server } from "../../services/server";
import { clockFormatter } from "../../utilities/clockFormatter";
import showToast from "../../utilities/toast";
import Button from "../Button";
import FormGroup from "../FormGroup";

interface CreateActivityModalProps {
  patients: Patient[];
  setPatients: (value: Patient[]) => void;
  setOpen: (value: boolean) => void;
}

export default function CreateActivityModal(props: CreateActivityModalProps) {
  const { user } = useContext(AuthenticateContext);
  const { patient } = useContext(PatientContext);

  if (!patient) {
    return null;
  }

  const activities = patient.activities?.length ?? 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!patient) {
      showToast("Paciente não encontrado!", 500);
      return;
    }

    if (!patient.report) {
      showToast(`${patient.name.split(" ")[0]} não enviou o laudo médico!`, 500);
      return;
    }

    const data = new FormData(event.target as HTMLFormElement);

    const activity = data.get("activity");
    const duration = clockFormatter(data.get("duration")?.toString() ?? "");
    const description = data.get("description");

    if (!activity || !duration || !description) {
      showToast("Preencha todos os campos", 500);
      return;
    }

    if (duration < 1) {
      showToast("Duração inválida", 500);
      return;
    }

    if (!user) {
      showToast("Erro ao validar sua conta, por favor, tente novamente!", 500);
      props.setOpen(false);
      return;
    }

    if (user.type !== "medic") {
      showToast("Apenas médicos podem adicionar atividades a pacientes!", 500);
      props.setOpen(false);
      return;
    }

    try {
      const { data } = await server.post("/activity", {
        name: activity,
        duration,
        description,
        authorEmail: user.email,
        patientEmail: patient.email
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

      props.setPatients(props.patients.map(p => p.email === patient.email ? newPatient : p));

      showToast("Atividade adicionada com sucesso!", 500);
    } catch (error) {
      showToast("Erro ao adicionar atividade, atualize a página e tente novamente!", 500);
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
      <Dialog.Overlay className="bg-black/60 inset-0 fixed">

        <Dialog.Content className="bg-[#181818] fixed py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 
    -translate-y-1/2 rounded-lg w-[95%] sm:w-[550px] max-h-[750px] shadow-lg shadow-black/25">

          <Dialog.Title className="text-3xl text-center font-inter font-black mb-6">
            Adicionar atividade
          </Dialog.Title>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-5 sm:mb-0">
            <img
              onError={event => event.currentTarget.src = userSVG}
              className="max-w-[180px] max-h-[180px] min-w-[180px] min-h-[180px] rounded-full shadow-image sm:mb-5"
              src={patient.avatarUrl ?? userSVG}
              width={180} draggable={false} />

            <div className="flex flex-col text-description text-center sm:text-start">
              <span className="text-xl">
                {patient.name}
              </span>
              <span>
                {activities} atividade{activities !== 1 && "s"}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            <FormGroup
              name="activity"
              title="Atividade"
              placeholder="Nome do exercício" />

            <div className="flex flex-col uppercase text-sm font-semibold">
              <label htmlFor="duration">
                Duração
              </label>

              <input className="bg-[#252222] p-2 rounded-sm text-text font-normal placeholder-text placeholder:text-sm focus:outline-1 focus:outline-button-base focus:outline"
                onBeforeInput={handleBeforeInput}
                type="text" name="duration" id="duration" title="Exemplo de duração: 00:00:00"
                placeholder="Duração do exercício" />
            </div>

            <FormGroup
              name="description"
              title="Descrição"
              placeholder="Descrição do exercício"
              textarea />

            <div className="flex gap-2">
              <Button title="Adicionar" />

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