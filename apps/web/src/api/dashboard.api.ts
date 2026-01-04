import { api } from "./axios";


export async function getDashboardSummary() {
    const res = await api.get("/dashboard/summary");
  return res.data;
}

export async function getDashboardGraphSummary() {
  const res = await api.get("/dashboard/graph-summary");
  return res.data;
}