import { CaretDown, CaretUp } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useContext, useEffect, useState } from "react";

import Activity from "../components/Account/Activity";
import CreateActivityModal from "../components/Account/CreateActivityModal";
import DefineMedicModal from "../components/Account/DefineMedicModal";
import { Patient } from "../components/Account/Patient";
import { Profile } from "../components/Account/Profile";
import { Report } from "../components/Account/Report";
import Footer from "../components/Footer";
import Header from "../components/Header/Header";
import Searcher from "../components/Searcher";
import {
  AuthenticateContext,
  Activity as IActivity,
} from "../context/AuthenticateContext";
import { Patient as IPatient } from "../context/PatientContext";
import { api } from "../services/api";
import Loading from "./Loading";

export default function Account() {
  const { loading, user } = useContext(AuthenticateContext);

  const [showModal, setShowModal] = useState(false);

  const [showPatients, setShowPatients] = useState(false);
  const [showActivities, setShowActivities] = useState(false);

  const [patients, setPatients] = useState<IPatient[]>([]);

  const [filteredPatients, setFilteredPatients] = useState<IPatient[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<IActivity[]>([]);

  const isAdmin = user?.type === "admin";
  const isMedic = user?.type === "medic";

  document.title = "Conta - MTI";

  useEffect(() => {
    if (!user || (!isAdmin && !isMedic)) return;

    api.get("/users").then((response) => setPatients(response.data));
  }, []);

  useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);

  if (loading || !user) {
    return <Loading account />;
  }

  function patientSearcher(value: string) {
    const filteredPatients = patients.filter((patient) =>
      patient.name.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredPatients(filteredPatients);
  }

  function activitySearcher(value: string) {
    if (!user) return;

    const filteredActivities = user.activities.filter((activity) =>
      activity.name.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredActivities(filteredActivities);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header account />

      <main className="mx-auto my-8 w-full max-w-5xl flex-1 px-6 sm:px-0">
        <Profile />

        {user.type === "medic" && patients.length > 0 && (
          <div className="mt-8">
            <h2
              onClick={() => setShowPatients(!showPatients)}
              className="flex cursor-pointer items-center gap-2 text-3xl text-title"
            >
              Pacientes
              {showPatients ? (
                <CaretUp size={20} color="#EBA417" weight="bold" />
              ) : (
                <CaretDown
                  size={20}
                  color="#EBA417"
                  weight="bold"
                  className="animate-bounce"
                />
              )}
            </h2>

            <Searcher
              onChangeHandler={patientSearcher}
              className={`my-2 ${showPatients ? "visible opacity-100" : "invisible opacity-0"} transition-all duration-500`}
            />

            <div
              className={`max-h-[425px] overflow-y-hidden ${showPatients ? "hover:overflow-y-auto" : ""}`}
            >
              <Dialog.Root open={showModal} onOpenChange={setShowModal}>
                <CreateActivityModal
                  setOpen={setShowModal}
                  patients={patients}
                  setPatients={setPatients}
                />

                {filteredPatients.map((patient, index) => (
                  <Patient
                    key={index}
                    patient={patient}
                    showPatients={showPatients}
                  />
                ))}
              </Dialog.Root>
            </div>
          </div>
        )}

        {user.type === "patient" && user.activities?.length > 0 && (
          <div className="mt-8">
            <h2
              onClick={() => setShowActivities(!showActivities)}
              className="flex cursor-pointer items-center gap-2 text-3xl text-title"
            >
              Atividades para você realizar
              {showActivities ? (
                <CaretUp size={20} color="#EBA417" weight="bold" />
              ) : (
                <CaretDown
                  size={20}
                  color="#EBA417"
                  weight="bold"
                  className="animate-bounce"
                />
              )}
            </h2>

            <Searcher
              onChangeHandler={activitySearcher}
              className={`my-2 ${showActivities ? "visible max-h-10 opacity-100" : "invisible max-h-0 opacity-0"} transition-all duration-500`}
            />

            <div
              className={`overflow-y-hidden ${showActivities ? "max-h-[585px] hover:overflow-y-auto" : "max-h-0"}`}
            >
              {filteredActivities.map((activity, index) => (
                <Activity
                  key={index}
                  activity={activity}
                  showActivities={showActivities}
                />
              ))}
            </div>
          </div>
        )}

        {user.type === "patient" && <Report user={user} />}

        {user.type === "admin" && (
          <div className="mt-8">
            <h2
              onClick={() => setShowPatients(!showPatients)}
              className="flex cursor-pointer items-center justify-center gap-2 text-center text-3xl text-title sm:justify-start sm:text-left"
            >
              Usuários para gerênciar
              {showPatients ? (
                <CaretUp size={20} color="#EBA417" weight="bold" />
              ) : (
                <CaretDown
                  size={20}
                  color="#EBA417"
                  weight="bold"
                  className="animate-bounce"
                />
              )}
            </h2>

            <Searcher
              onChangeHandler={patientSearcher}
              className={`my-2 ${showPatients ? "visible max-h-10 opacity-100" : "invisible max-h-0 opacity-0"} transition-all duration-500`}
            />

            <div
              className={`overflow-y-hidden ${showPatients ? "max-h-[585px] hover:overflow-y-auto" : "max-h-0"}`}
            >
              <Dialog.Root open={showModal} onOpenChange={setShowModal}>
                <DefineMedicModal
                  setOpen={setShowModal}
                  patients={patients}
                  setPatients={setPatients}
                />

                {filteredPatients.map((patient, index) => (
                  <Patient
                    key={index}
                    patient={patient}
                    showPatients={showPatients}
                  />
                ))}
              </Dialog.Root>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
