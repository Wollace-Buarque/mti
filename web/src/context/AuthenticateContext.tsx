import { createContext, useEffect, useState } from "react";

import { server } from "../services/server";

interface AuthenticateContextData {
  loading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  medic: boolean;
  report?: Report;
  createdAt: Date;
  avatarUrl: string;
  activities: Activity[];
}

export interface Activity {
  id: number;
  name: string;
  author: User;
  duration: number;
  updatedAt: Date;
  createadAt: Date;
  description: string;
}

export interface Report {
  id: number;
  reportUrl: string;
  updatedAt: Date;
}

export const AuthenticateContext = createContext({} as AuthenticateContextData);

export const AuthenticateProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    server.get(`/token/${token}`).then(response => {

      if (response.status !== 201) {
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      setUser({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        token: response.data.token,
        medic: response.data.medic,
        report: response.data.report,
        avatarUrl: response.data.avatarUrl,
        createdAt: new Date(response.data.createdAt),
        activities: response.data.activities
      });

      setLoading(false);
    });

  }, []);

  return (
    <AuthenticateContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthenticateContext.Provider>
  );
};