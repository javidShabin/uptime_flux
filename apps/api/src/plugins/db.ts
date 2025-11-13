import fp from "fastify-plugin";
import mongoose from "mongoose";
import { env } from "../config/env.js";

async function mongoPlugin() {
  try {
    // Recommended Mongoose options
    await mongoose.connect(env.MONGO_URL, {
      // Avoid connection warnings
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("📦 MongoDB connected:", env.MONGO_URL);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

export default fp(mongoPlugin);
