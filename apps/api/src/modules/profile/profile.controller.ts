import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ProfileService } from "./profile.service.js";
import { ProfileError } from "./profile.errors.js";
import { updateProfileSchema, getProfileByIdSchema, verifyTwoFactorSchema, disableTwoFactorSchema } from "./profile.schemas.js";
import { TwoFactorService } from "./twoFactor.service.js";
import { UserModel } from "../authentication/auth.model.js";

export class ProfileController {
  private readonly twoFactorService: TwoFactorService;

  constructor(private readonly profileService: ProfileService) {
    this.twoFactorService = new TwoFactorService();
  }

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

  /**
   * Setup 2FA
   */
  setupTwoFactor = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      
      // Get user email
      const user = await UserModel.findById(userId).select("email").lean();
      if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }

      const result = await this.twoFactorService.setupTwoFactor(
        request.server,
        userId,
        user.email
      );

      return reply.code(200).send(result);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Verify and enable 2FA
   */
  verifyTwoFactor = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const payload = verifyTwoFactorSchema.parse(request.body);

      const result = await this.twoFactorService.verifyTwoFactor(
        request.server,
        userId,
        payload.token
      );

      return reply.code(200).send(result);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Disable 2FA
   */
  disableTwoFactor = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const payload = disableTwoFactorSchema.parse(request.body);

      await this.twoFactorService.disableTwoFactor(
        request.server,
        userId,
        payload.token
      );

      return reply.code(200).send({
        message: "Two-factor authentication has been disabled successfully",
      });
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };
}

