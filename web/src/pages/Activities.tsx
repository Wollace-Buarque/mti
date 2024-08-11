import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import userSVG from "../assets/user.svg";
import Header from "../components/Header/Header";
import Searcher from "../components/Searcher";
import { ActivityItem } from "../components/activities/activity-item";
import { ReportSummary } from "../components/report-summary";
import { Activity, AuthenticateContext } from "../context/AuthenticateContext";
import { Patient } from "../context/PatientContext";
import { server } from "../services/server";
import showToast from "../utilities/toast";
import Loading from "./Loading";

async function fetchPatient(id: string | undefined) {
  const { data } = await server.get(`/id/${id}`);

  if (!data.found) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    email: data.email,
    report: data.report,
    avatarUrl: data.avatarUrl,
    activities: data.activities,
    createdAt: new Date(data.createdAt),
  };
}

export default function Activities() {
  const { user, loading } = useContext(AuthenticateContext);
  const { id } = useParams();

  const [patient, setPatient] = useState<Patient | null>();
  const [isLoadingPatient, setIsLoadingPatient] = useState(true);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  const isMedic = user?.type === "medic";
  const isAdmin = user?.type === "admin";
  const hasActivities = (patient?.activities?.length || 0) > 0;

  useEffect(() => {
    setIsLoadingPatient(true);

    fetchPatient(id)
      .then((data) => setPatient(data))
      .finally(() => setIsLoadingPatient(false));
  }, [id]);

  document.title = "Paciente - MTI";

  if (loading || isLoadingPatient) {
    return <Loading />;
  }

  if (!loading && !isLoadingPatient && !patient) {
    return <Navigate to="/" />;
  }

  document.title = `${patient?.name} - MTI`;

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

    if (!isAdmin && !isMedic) {
      showToast("Você não pode realizar esta ação!");
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
    } catch (error) {
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
            className="size-40 rounded-full shadow-image"
            src={patient?.avatarUrl ?? userSVG}
            draggable={false}
          />

          <div>
            <h3 className="text-2xl text-title text-semibold">
              {patient?.name}
            </h3>

            <span className="text-sm text-description block mt-1.5">
              {patient?.email}
            </span>

            <span className="text-sm text-description">
              Desde{" "}
              {patient?.createdAt.toLocaleString("pt-BR", {
                dateStyle: "long",
              })}
            </span>
          </div>
        </div>

        {!hasActivities && (
          <p className="text-3xl mt-7">Nenhuma atividade encontrada.</p>
        )}

        {(isMedic || isAdmin) && hasActivities && (
          <div className="mt-8">
            <h2 className="flex items-center gap-2 text-title text-3xl">
              Atividades
            </h2>

            <Searcher className="my-2" onChangeHandler={activitySearcher} />

            <div className="max-h-[650px] overflow-y-hidden hover:overflow-y-auto">
              {filteredActivities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  removeAction={removeActivity}
                />
              ))}
            </div>
          </div>
        )}

        {patient?.report && (
          <div className="mt-4">
            <ReportSummary
              updatedAt={new Date(patient.report.updatedAt)}
              reportUrl={patient.report.reportUrl}
            />
          </div>
        )}
      </main>
    </div>
  );
}
