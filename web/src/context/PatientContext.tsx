import { createContext, useState } from "react";

import { User } from "./AuthenticateContext";

interface PatientContextData {
  patient: Patient | null;
  setPatient: (patient: Patient | null) => void;
}

export type Patient = Pick<
  User,
  | "id"
  | "name"
  | "email"
  | "type"
  | "report"
  | "activities"
  | "avatarUrl"
  | "createdAt"
>;

export const PatientContext = createContext({} as PatientContextData);

export const PatientProvider = ({ children }: any) => {
  const [patient, setPatient] = useState<Patient | null>({} as Patient);

  return (
    <PatientContext.Provider value={{ patient, setPatient }}>
      {children}
    </PatientContext.Provider>
  );
};
