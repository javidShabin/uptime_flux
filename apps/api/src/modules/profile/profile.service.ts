import type { FastifyInstance } from "fastify";
import { Types } from "mongoose";
import { ProfileModel, type IProfile } from "./profile.model.js";
import { UserModel } from "../authentication/auth.model.js";
import { ProfileError } from "./profile.errors.js";
import { deleteFromCloudinary, extractPublicIdFromUrl, uploadToCloudinary } from "../../utils/upload.js";
import { DEFAULT_AVATAR_URL } from "../../config/constants.js";
import type { UpdateProfileInput } from "./profile.schemas.js";

export interface ProfileResponse {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  name?: string;
  avatarUrl: string;
  timezone: string;
  twoFactorEnabled: boolean;
  lastPasswordChange?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class ProfileService {
  constructor() {}

  /**
   * Get profile by user ID
   */
  async getProfileById(userId: string): Promise<ProfileResponse> {
    // Validate ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new ProfileError(400, "Invalid user ID format");
    }

    // Find user to get email
    const user = await UserModel.findById(userId).select("firstName lastName email").lean();
    if (!user) {
      throw new ProfileError(404, "User not found");
    }

    // Find or create profile
    let profile = await ProfileModel.findOne({ userId: new Types.ObjectId(userId) });

    if (!profile) {
      // Create default profile if it doesn't exist
      profile = await ProfileModel.create({
        userId: new Types.ObjectId(userId),
        firstName: user.firstName,
        lastName: user.lastName,
        name: "",
        avatarUrl: DEFAULT_AVATAR_URL,
        timezone: "UTC",
        twoFactorEnabled: false,
        twoFactorSecretEncrypted: null,
      });
    }

    return {
      id: String(profile._id),
      userId: String(profile.userId),
      firstName: profile.firstName || user.firstName,
      lastName: profile.lastName || user.lastName,
      email: user.email,
      name: profile.name || undefined,
      avatarUrl: profile.avatarUrl || DEFAULT_AVATAR_URL,
      timezone: profile.timezone || "UTC",
      twoFactorEnabled: profile.twoFactorEnabled || false,
      lastPasswordChange: profile.lastPasswordChange || undefined,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  /**
   * Update profile
   */
  async updateProfile(
    app: FastifyInstance,
    userId: string,
    data: UpdateProfileInput,
    avatarFile?: any
  ): Promise<ProfileResponse> {
    // Validate ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new ProfileError(400, "Invalid user ID format");
    }

    // Verify user exists
    const user = await UserModel.findById(userId).select("firstName lastName email").lean();
    if (!user) {
      throw new ProfileError(404, "User not found");
    }

    // Find or create profile
    let profile = await ProfileModel.findOne({ userId: new Types.ObjectId(userId) });

    if (!profile) {
      profile = await ProfileModel.create({
        userId: new Types.ObjectId(userId),
        firstName: user.firstName,
        lastName: user.lastName,
        name: "",
        avatarUrl: DEFAULT_AVATAR_URL,
        timezone: "UTC",
        twoFactorEnabled: false,
        twoFactorSecretEncrypted: null,
      });
    }

    // Handle avatar upload if provided
    if (avatarFile) {
      try {
        // Delete old avatar from Cloudinary if it exists and is not the default
        if (profile.avatarUrl && profile.avatarUrl !== DEFAULT_AVATAR_URL) {
          const oldPublicId = extractPublicIdFromUrl(profile.avatarUrl);
          if (oldPublicId) {
            try {
              await deleteFromCloudinary(oldPublicId, app.cloudinary);
            } catch (error) {
              // Log error but don't fail the update
              console.error("Failed to delete old avatar:", error);
            }
          }
        }

        // Upload new avatar
        const uploadResult = await uploadToCloudinary(avatarFile, app.cloudinary, {
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

        profile.avatarUrl = uploadResult.secureUrl;
      } catch (error) {
        throw new ProfileError(
          400,
          error instanceof Error ? error.message : "Failed to upload avatar"
        );
      }
    }

    // Update profile fields
    if (data.firstName !== undefined) {
      profile.firstName = data.firstName;
    }
    if (data.lastName !== undefined) {
      profile.lastName = data.lastName;
    }
    if (data.name !== undefined) {
      profile.name = data.name;
    }
    if (data.timezone !== undefined) {
      profile.timezone = data.timezone;
    }

    await profile.save();

    // Return updated profile
    return {
      id: String(profile._id),
      userId: String(profile.userId),
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: user.email,
      name: profile.name || undefined,
      avatarUrl: profile.avatarUrl || DEFAULT_AVATAR_URL,
      timezone: profile.timezone || "UTC",
      twoFactorEnabled: profile.twoFactorEnabled || false,
      lastPasswordChange: profile.lastPasswordChange || undefined,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}

