import { CaretDown, CaretUp } from "phosphor-react";
import { useContext, useEffect, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";

import Activity from "../components/Account/Activity";
import CreateActivityModal from "../components/Account/CreateActivityModal";
import Patient from "../components/Account/Patient";
import Profile from "../components/Account/Profile";
import Report from "../components/Account/Report";
import Footer from "../components/Footer";
import Header from "../components/Header/Header";
import Searcher from "../components/Searcher";
import { Activity as IActivity, AuthenticateContext, User } from "../context/AuthenticateContext";
import { Patient as IPatient } from "../context/PatientContext";
import { server } from "../services/server";
import Loading from "./Loading";

export default function Account() {
  const { loading, user } = useContext(AuthenticateContext);

  const [showModal, setShowModal] = useState(false);

  const [showPatients, setShowPatients] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [patients, setPatients] = useState<IPatient[]>([]);

  const [filteredPatients, setFilteredPatients] = useState<IPatient[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<IActivity[]>([]);

  document.title = "Conta - MTI";

  useEffect(() => {
    if (!user || !user.medic) return;

    server.get("/users").then(response => {

      setPatients(response.data.filter((patient: User) => !patient.medic)
        .sort((a: IPatient, b: IPatient) => a.activities?.length - b.activities?.length));

    });
  }, []);

  if (loading || !user) {
    return <Loading account />
  }

  function patientSearcher(value: string) {
    const filteredPatients = patients.filter(patient => patient.name.toLowerCase().includes(value.toLowerCase()));

    setFilteredPatients(filteredPatients);
  }

  function activitySearcher(value: string) {
    if (!user) return;

    const filteredActivities = user.activities.filter(activity => activity.name.toLowerCase().includes(value.toLowerCase()));

    setFilteredActivities(filteredActivities);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header account />

      <main className="max-w-5xl mx-auto w-full flex-1 my-8 px-6 sm:px-0">

        <Profile />

        {user.medic && patients.length > 0 && (
          <div className="mt-8">
            <h2
              onClick={() => setShowPatients(!showPatients)}
              className="flex items-center gap-2 text-title text-3xl cursor-pointer">

              Pacientes

              {showPatients
                ? <CaretUp size={20} color="#EBA417" weight="bold" />
                : <CaretDown size={20} color="#EBA417" weight="bold" className="animate-bounce" />}
            </h2>

            <Searcher
              onChangeHandler={patientSearcher}
              className={`my-2 ${showPatients ? "opacity-100 visible" : "opacity-0 invisible"} transition-all duration-500`} />

            <div className={`max-h-[425px] overflow-y-hidden ${showPatients ? "hover:overflow-y-auto" : ""}`}>

              <Dialog.Root open={showModal} onOpenChange={setShowModal}>
                <CreateActivityModal
                  setOpen={setShowModal}
                  patients={patients}
                  setPatients={setPatients} />

                {filteredPatients.map((patient, index) => (
                  <Patient
                    key={index}
                    patient={patient}
                    showPatients={showPatients}
                    setShowModal={setShowModal}
                  />
                ))}
              </Dialog.Root>
            </div>
          </div>
        )}

        {!user.medic && user.activities?.length > 0 && (
          <div className="mt-8">

            <h2
              onClick={() => setShowActivities(!showActivities)}
              className="flex items-center gap-2 text-title text-3xl cursor-pointer">

              Atividades para você realizar

              {showActivities
                ? <CaretUp size={20} color="#EBA417" weight="bold" />
                : <CaretDown size={20} color="#EBA417" weight="bold" />}
            </h2>

            <Searcher
              onChangeHandler={activitySearcher}
              className={`my-2 ${showActivities ? "opacity-100 visible max-h-10" : "opacity-0 invisible max-h-0"} transition-all duration-500`} />

            <div className={`overflow-y-hidden ${showActivities ? "hover:overflow-y-auto max-h-[585px]" : "max-h-0"}`}>

              {filteredActivities.map((activity, index) => (
                <Activity
                  key={index}
                  activity={activity}
                  showActivities={showActivities} />
              ))}

            </div>
          </div>
        )}

        {!user.medic && (
          <Report user={user} />
        )}

      </main>

      <Footer />
    </div>
  );
}