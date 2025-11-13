import { Job } from "bullmq";
import axios from "axios";

export default async function monitorProcessor(job: Job) {
  const { monitorId, url, timeout } = job.data;

  const start = Date.now();

  try {
    const response = await axios.get(url, { timeout: timeout || 5000 });

    const latency = Date.now() - start;

    return {
      monitorId,
      status: "up",
      statusCode: response.status,
      latency,
    };
  } catch (err: any) {
    const latency = Date.now() - start;

    return {
      monitorId,
      status: "down",
      error: err.message,
      latency,
    };
  }
}
