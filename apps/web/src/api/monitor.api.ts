import { api } from "./axios";

export async function getMonitors():Promise<any> {
  const res = await api.get("/monitors/get");
  console.log(res)
  return res.data;
}

export async function createMonitor(data: {
    url: string
    interval: number
}):Promise<any> {
    const res = await api.post("/monitors/create", data)
    return res.data
}

export async function updateMonitor(
  monitorId: string,
  data: {url:string; interval:number}
):Promise<any>{
  const res = await api.patch(`/monitors/update/${monitorId}`, data)
  return res.data
}