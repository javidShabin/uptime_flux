import { api } from "./axios";

export async function getMonitors() {
  const res = await api.get("/monitors/get");
  console.log(res, "===monitor detials geting")
  return res.data;
}
