import fp from "fastify-plugin";
import { v2 as cloudinary } from "cloudinary";
import type { FastifyInstance } from "fastify";
import { env } from "../config/env.js";

// Type declarations for Cloudinary plugin
declare module "fastify" {
  interface FastifyInstance {
    cloudinary: typeof cloudinary;
  }
}

export default fp(async (app: FastifyInstance) => {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: env.CLOUD_NAME,
    api_key: env.CLOUD_API_KEY,
    api_secret: env.CLOUD_API_SECRET,
  });

  // Decorate Fastify instance with cloudinary
  app.decorate("cloudinary", cloudinary);

  console.log("☁️ Cloudinary configured:", env.CLOUD_NAME);
});

