import { useContext, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { Trash } from "phosphor-react";

import { Activity, AuthenticateContext } from "../context/AuthenticateContext";
import { Patient } from "../context/PatientContext";

import * as HoverCard from "@radix-ui/react-hover-card";

import MedicCard from "../components/Account/MedicCard";
import Header from "../components/Header/Header";
import ImageModal from "../components/ImageModal";
import Searcher from "../components/Searcher";
import showToast from "../utilities/toast";
import Loading from "./Loading";


import { server } from "../services/server";
import { secondsFormatter } from "../utilities/secondsFormatter";

import userSVG from "../assets/user.svg";

export default function Activities() {
  const { user, loading } = useContext(AuthenticateContext);
  const { id } = useParams();

  const [patient, setPatient] = useState<Patient>();
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  useEffect(() => {
    server.get(`/id/${id}`).then((response) => {
      setPatient({
        id: response.data.id,
        name: response.data.name,
        type: response.data.type,
        email: response.data.email,
        report: response.data.report,
        avatarUrl: response.data.avatarUrl,
        activities: response.data.activities,
        createdAt: new Date(response.data.createdAt),
      });
    });
  }, []);

  document.title = "Paciente - MTI";

  if (!user || !patient || loading) {
    return <Loading />;
  }

  document.title = `${patient.name} - MTI`;

  function activitySearcher(value: string) {
    if (!patient) return;

    const filteredActivities = patient.activities.filter((activity) =>
      activity.name.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredActivities(filteredActivities);
  }

  async function removeActivity(activityId: number) {
    if (!user) {
      showToast("Você precisa estar logado!");
      return;
    }

    if (user.type !== "medic") {
      showToast("Apenas médicos podem deletar atividades!");
      return;
    }

    if (!patient) {
      showToast("Paciente não encontrado!");
      return;
    }

    try {
      const { data } = await server.delete(`/activity/${activityId}`);

      if (data !== "Activity deleted") {
        showToast("Atividade não encontrada ou já deletada!");
        return;
      }

      showToast("Atividade deletada com sucesso!");

      const newActivities = patient.activities.filter(
        (activity) => activity.id !== activityId,
      );

      setPatient({
        ...patient,
        activities: newActivities,
      });

      setFilteredActivities(newActivities);
    } catch (error: any) {
      showToast("Ocorreu um erro ao tentar deletar atividade!");
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="max-w-5xl mx-auto w-full flex-1 my-8 px-6 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 h-fit">
          <img
            onError={(event) => (event.currentTarget.src = userSVG)}
            className="size-40 max-w-40 max-h-40 rounded-full shadow-image"
            src={patient?.avatarUrl ?? userSVG}
            width={160}
            height={160}
            draggable={false}
          />

          <div>
            <h3 className="text-2xl text-title text-semibold">
              {patient?.name}
            </h3>

            <span className="text-sm text-description">
              Desde{" "}
              {patient?.createdAt.toLocaleString("pt-BR", {
                dateStyle: "long",
              })}
            </span>
          </div>
        </div>

        {user.type === "medic" && patient.activities?.length > 0 ? (
          <div className="mt-8">
            <h2 className="flex items-center gap-2 text-title text-3xl">
              Atividades
            </h2>

            <Searcher className="my-2" onChangeHandler={activitySearcher} />

            <div className="max-h-[650px] overflow-y-hidden hover:overflow-y-auto">
              {filteredActivities.map((activity, index) => (
                <div key={index} className="my-7 first:mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-line">
                    <div className="flex items-center gap-1">
                      <h3 className="text-2xl">{activity.name}</h3>

                      <span className="text-button-base text-2xl">–</span>

                      <span className="text-sm text-[#AAA]">
                        {secondsFormatter(activity.duration)} de duração
                      </span>
                    </div>

                    <div className="flex gap-2 items-end">
                      <HoverCard.Root>
                        <MedicCard medic={activity.author} />

                        <span className="text-sm text-[#AAA]">
                          Indicada por{" "}
                          <HoverCard.Trigger className="underline cursor-pointer">
                            {activity.author.name}
                          </HoverCard.Trigger>
                        </span>
                      </HoverCard.Root>

                      <button
                        title={`Deletar atividade ${activity.name} do médico ${activity.author.name}`}
                        className="absolute ml-60"
                        onClick={() => removeActivity(activity.id)}
                      >
                        <Trash className="text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 ml-1 pr-1 text-description max-h-72 overflow-y-auto break-words">
                    {activity.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-3xl mt-7">Nenhuma atividade encontrada.</p>
        )}

        {patient.report && (
          <div className="mt-4">
            <h2 className="text-title text-3xl">Relatório médico</h2>

            <p className="text-sm text-[#AAA]">
              Atualizado em{" "}
              {new Date(patient.report.updatedAt).toLocaleString("pt-BR", {
                dateStyle: "long",
              })}
            </p>

            <ImageModal
              src={patient.report.reportUrl}
              className="w-full h-full oject-cover shadow-elevation rounded mt-4"
              draggable={false}
            />
          </div>
        )}
      </main>
    </div>
  );
}
