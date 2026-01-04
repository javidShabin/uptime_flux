import mongoose from "mongoose";
import { env } from "./env";

let connected = false;

export async function connectMongo() {
  if (connected) return;

  await mongoose.connect(env.MONGO_URI);
  connected = true;

  console.log("✅ Worker MongoDB connected");
}

export async function disconnectMongo() {
  if (!connected) return;

  await mongoose.disconnect();
  connected = false;

  console.log("🛑 Worker MongoDB disconnected");
}
