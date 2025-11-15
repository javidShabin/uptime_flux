import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { uploadToCloudinary } from "../../utils/upload.js";

export default async function profileRoutes(app: FastifyInstance) {
  // Example: Upload avatar image
  app.post("/upload-avatar", { preHandler: [app.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();
      
      if (!data) {
        return reply.code(400).send({ error: "No file uploaded" });
      }

      const result = await uploadToCloudinary(data, app.cloudinary, {
        folder: "avatars",
        allowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxFileSize: 5 * 1024 * 1024, // 5MB
        transformation: {
          width: 400,
          height: 400,
          crop: "fill",
          quality: "auto",
        },
      });

      return reply.code(200).send({
        message: "Avatar uploaded successfully",
        image: {
          url: result.secureUrl,
          publicId: result.publicId,
          width: result.width,
          height: result.height,
        },
      });
    } catch (error: any) {
      return reply.code(400).send({ error: error.message || "Upload failed" });
    }
  });
}

