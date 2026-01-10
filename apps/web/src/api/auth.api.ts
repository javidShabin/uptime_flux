import { api } from "./axios";

export async function login(data: { email: string; password: string }) {
  const res = await api.post("/auth/login", data);
  console.log(res, "====login response")
  return res.data;
}

export async function register(data: {
  email: string;
  password: string;
  name: string;
}) {
  const res = await api.post("/auth/register", data);
  return res.data;
}

export async function verifyEmail(data: { email: string; otp: string }) {
  const res = await api.post("/auth/verify-email", data);
  return res.data;
}