import { List } from "phosphor-react";
import { useContext } from "react";
import { Link } from "react-router-dom";

import * as Dialog from "@radix-ui/react-dialog";

import userSVG from "../../assets/user.svg";
import { Patient as IPatient, PatientContext } from "../../context/PatientContext";

interface PatientProps {
  patient: IPatient;
  showPatients: boolean;
  setShowModal: (value: boolean) => void;
}

export default function Patient(props: PatientProps) {
  const { setPatient } = useContext(PatientContext);
  const activities = props.patient.activities?.length ?? 0;

  function onAvatarError(event: any) {
    (event.target as HTMLImageElement).src = userSVG;
  }

  return (
    <Dialog.Trigger
      onClick={() => setPatient(props.patient)}
      className={`w-full ${props.showPatients ? "opacity-100 visible" : "opacity-0 invisible"} transition-all duration-500`}>

      <div className="flex justify-between items-center p-2 cursor-pointer rounded active:bg-[#303030] transition-colors duration-500">

        <div className="flex gap-3">
          <img
            onError={onAvatarError}
            className="min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px] shadow-image rounded-full"
            src={props.patient?.avatarUrl ?? userSVG}
            width={100} height={100} draggable={false} loading="lazy" />

          <div className="flex flex-col self-center text-start text-description">
            <span>
              {props.patient.name}
            </span>

            <span className="text-sm">
              {activities} atividade{activities !== 1 && "s"}
            </span>

            {!props.patient.report && (
              <span className="text-sm text-red-500">
                Laudo médico não enviado!
              </span>
            )}
          </div>
        </div>

        <Link
          title={`Ver atividades de ${props.patient.name}`}
          to={`/patient/${props.patient.id}`}
          className="p-1 hover:scale-125 transition-transform">
          <List size={15}
            color="#EBA417"
            weight="bold"
            onClick={event => event.stopPropagation()} />
        </Link>
      </div>
    </Dialog.Trigger>
  );
}