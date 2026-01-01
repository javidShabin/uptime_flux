import { api } from "./axios";

export async function getIncidents(params?: {
    monitorId?: string
    status?: string
}) {
    const res = await api.get("/incidents", {params})
    return res.data
}