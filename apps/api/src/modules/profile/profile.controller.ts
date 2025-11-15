import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ProfileService } from "./profile.service.js";
import { ProfileError } from "./profile.errors.js";
import { updateProfileSchema, getProfileByIdSchema } from "./profile.schemas.js";

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  private handleError(error: unknown, request: FastifyRequest, reply: FastifyReply) {
    if (error instanceof ProfileError) {
      return reply.code(error.statusCode).send({
        error: error.message,
      });
    }

    if (error instanceof Error && error.name === "ZodError") {
      return reply.code(400).send({
        error: "Validation error",
        details: (error as any).errors,
      });
    }

    request.log.error(error, "Profile error");
    return reply.code(500).send({
      error: "Internal server error",
    });
  }

  /**
   * Get profile by ID
   */
  getProfileById = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = getProfileByIdSchema.parse(request.params);
      const profile = await this.profileService.getProfileById(params.id);
      return reply.code(200).send(profile);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Get current user's profile
   */
  getMyProfile = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const profile = await this.profileService.getProfileById(userId);
      return reply.code(200).send(profile);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Update current user's profile
   */
  updateProfile = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const data = await request.file();
      
      // Parse form fields
      let updateData: any = {};
      if (data) {
        // If file is uploaded, get other fields from form
        const formData: any = {};
        for await (const part of request.parts()) {
          if (part.type === "field") {
            formData[part.fieldname] = part.value;
          }
        }
        
        updateData = updateProfileSchema.parse({
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: formData.name,
          timezone: formData.timezone,
        });
      } else {
        // No file, parse JSON body
        updateData = updateProfileSchema.parse(request.body);
      }

      const profile = await this.profileService.updateProfile(
        request.server,
        userId,
        updateData,
        data
      );

      return reply.code(200).send(profile);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };
}

