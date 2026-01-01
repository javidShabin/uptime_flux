import { api } from "./axios";

export async function getMonitors() {
  const res = await api.get("/monitors/get");
  console.log(res, "===monitor detials geting")
  return res.data;
}

export async function createMonitor(data: {
    url: string
    interval: number
}) {
    const res = await api.post("/monitors/create", data)
    return res.data
}

// export async function createMonitor(data: {
//   url: string;
//   interval: number;
// }) {
//   const res = await api.post("/monitors", data);
//   return res.data;
// }