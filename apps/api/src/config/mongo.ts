import mongoose from "mongoose";
import { env } from "./env";

let isConnected = false;

/**
 * Connect to MongoDB (singleton)
 */
export async function connectMongo() {
  if (isConnected) return;

  try {
    await mongoose.connect(env.MONGO_URI, {
      autoIndex: env.NODE_ENV !== "production", // safer in prod
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1);
  }
}

/**
 * Gracefully disconnect MongoDB
 */
export async function disconnectMongo() {
  if (!isConnected) return;

  await mongoose.disconnect();
  isConnected = false;
  console.log("🛑 MongoDB disconnected");
}
