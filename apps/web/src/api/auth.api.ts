import { api } from "./axios";

export async function loginApi(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function registerApi(email: string, password: string) {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
}
