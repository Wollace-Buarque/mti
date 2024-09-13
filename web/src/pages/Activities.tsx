import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import userSVG from "../assets/user.svg";
import Searcher from "../components/Searcher";
import { ActivityItem } from "../components/activities/activity-item";
import { ReportSummary } from "../components/report-summary";
import { Activity, AuthenticateContext } from "../context/AuthenticateContext";
import { Patient } from "../context/PatientContext";
import { api } from "../services/api";
import { showToast } from "../utilities/toast";
import Loading from "./Loading";

async function fetchPatient(id: string | undefined) {
  const { data } = await api.get(`/id/${id}`);

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
      showToast({ message: "Você precisa estar logado!", type: "warning" });
      return;
    }

    if (!isAdmin && !isMedic) {
      showToast({
        message: "Apenas administradores ou médicos podem alterar algo.",
        type: "error",
      });
      return;
    }

    if (!patient) {
      showToast({ message: "Paciente não encontrado!", type: "error" });
      return;
    }

    try {
      const { data } = await api.delete(`/activity/${activityId}`);

      if (data !== "Activity deleted") {
        showToast({
          message: "Atividade não encontrada ou já deletada!",
          type: "error",
        });
        return;
      }

      showToast({
        message: "Atividade deletada com sucesso!",
      });

      const newActivities = patient.activities.filter(
        (activity) => activity.id !== activityId,
      );

      setPatient({
        ...patient,
        activities: newActivities,
      });

      setFilteredActivities(newActivities);
    } catch (error) {
      showToast({
        message: "Ocorreu um erro ao tentar deletar a atividade!",
        type: "error",
      });
    }
  }

  return (
    <>
      <div className="flex h-fit flex-col gap-6 sm:flex-row sm:items-center">
        <img
          onError={(event) => (event.currentTarget.src = userSVG)}
          className="size-40 rounded-full shadow-image"
          src={patient?.avatarUrl ?? userSVG}
          draggable={false}
        />

        <div>
          <h3 className="text-semibold text-2xl text-title">{patient?.name}</h3>

          <span className="mt-1.5 block text-sm text-description">
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
        <p className="mt-7 text-3xl">Nenhuma atividade encontrada.</p>
      )}

      {(isMedic || isAdmin) && hasActivities && (
        <div className="mt-8">
          <h2 className="flex items-center gap-2 text-3xl text-title">
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
    </>
  );
}
