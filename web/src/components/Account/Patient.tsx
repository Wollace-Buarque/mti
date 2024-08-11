import { MouseEvent, useContext } from "react";

import { Gear } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

import * as Dialog from "@radix-ui/react-dialog";

import {
  Patient as IPatient,
  PatientContext,
} from "../../context/PatientContext";

import userSVG from "../../assets/user.svg";

interface PatientProps {
  patient: IPatient;
  showPatients: boolean;
}

const SIX_MONTHS = 1000 * 60 * 60 * 24 * 30 * 6;

export function Patient({ patient, showPatients }: PatientProps) {
  const { setPatient } = useContext(PatientContext);

  const activities = patient.activities?.length ?? 0;
  const hasReport = !!patient?.report;
  const isReportTooOld =
    hasReport &&
    new Date(patient.report!.updatedAt) < new Date(Date.now() - SIX_MONTHS);

  const shouldShowReportMessage = !hasReport && !isReportTooOld && patient.type !== "medic";

  function handleClickSettings(event: MouseEvent) {
    event.stopPropagation();

    setPatient(patient);
  }

  function onAvatarError(event: any) {
    (event.target as HTMLImageElement).src = userSVG;
  }

  return (
    <div
      className={`flex items-center p-2 cursor-pointer ${showPatients ? "opacity-100 visible" : "opacity-0 invisible"}  rounded active:bg-[#303030] transition-colors duration-500`}
    >
      <Link
        title={`Ver atividades de ${patient.name}`}
        to={`/patient/${patient.id}`}
        className={`flex-1 shrink`}
      >
        <div>
          <div className="flex gap-3">
            <img
              onError={onAvatarError}
              className="size-24 shadow-image rounded-full"
              src={patient?.avatarUrl ?? userSVG}
              draggable={false}
              loading="lazy"
            />

            <div className="flex flex-col self-center text-start text-description">
              <span>{patient.name}</span>

              <span className="text-sm">
                {activities} atividade{activities !== 1 && "s"}
              </span>

                {isReportTooOld && (
                    <span className="text-sm text-orange-300">
                        Laudo médico com mais de 6 meses desatualizado!
                    </span>
                )}

              {shouldShowReportMessage &&  (
                <span className="text-sm text-red-500">
                  Laudo médico não enviado!
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <Dialog.Trigger
        onClick={handleClickSettings}
        className="p-1 hover:scale-125 transition-transform group"
      >
        <Gear
          size={20}
          color="#EBA417"
          weight="bold"
          className="group-hover:animate-spin-one-time"
        />
      </Dialog.Trigger>
    </div>
  );
}
