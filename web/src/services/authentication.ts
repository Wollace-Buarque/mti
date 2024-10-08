import { api } from "./api";

export async function login(email: string, password: string) {
  try {
    const { data } = await api.post(`/login`, {
      email,
      password,
    });

    return data;
  } catch (error) {
    return false;
  }
}

export async function register(name: string, email: string, password: string) {
  try {
    const { data } = await api.post(`/register`, {
      name,
      email,
      password,
    });

    return data;
  } catch (error) {
    return false;
  }
}
