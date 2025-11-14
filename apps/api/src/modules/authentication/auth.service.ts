import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { FastifyInstance } from "fastify";
import { env } from "../../config/env.js";
import { UserModel, type UserDocument, type SafeUser } from "./auth.model.js";
import { OtpModel, OtpType } from "./otp.model.js";
import { PendingRegistrationModel } from "./pending-registration.model.js";
import { EmailService } from "./email.service.js";
import { AuthError } from "./auth.errors.js";
import type {
  RegisterInput,
  LoginInput,
  VerifyOtpInput,
  ResendOtpInput,
} from "./auth.schemas.js";

const PASSWORD_SALT_ROUNDS = 10;
const OTP_MAX_ATTEMPTS = 5;
const REFRESH_TOKEN_HISTORY_LIMIT = 5;
const REFRESH_TOKEN_TTL_MS = env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenId: string;
  refreshTokenExpiresAt: Date;
}

export class AuthenticationService {
  readonly refreshTokenTtlSeconds = Math.floor(REFRESH_TOKEN_TTL_MS / 1000);

  constructor(private readonly emailService: EmailService) {}

  async issueOtp(email: string, type: OtpType) {
    const code = crypto.randomInt(100000, 999999).toString();
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRATION_MINUTES * 60 * 1000);

    await OtpModel.findOneAndUpdate(
      { email, type },
      {
        codeHash,
        expiresAt,
        attempts: 0,
        maxAttempts: OTP_MAX_ATTEMPTS,
      },
      { upsert: true, new: true }
    );

    await this.emailService.sendOtp(email, code);
  }

  async register(app: FastifyInstance, payload: RegisterInput) {
    const email = payload.email.toLowerCase();
    
    // Check if user already exists
    const existing = await UserModel.findOne({ email });
    if (existing) throw new AuthError(409, "Account already exists");

    // Check if pending registration exists
    const existingPending = await PendingRegistrationModel.findOne({ email });
    if (existingPending) throw new AuthError(409, "Registration already in progress. Please verify your email.");

    // Generate OTP
    const code = crypto.randomInt(100000, 999999).toString();
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRATION_MINUTES * 60 * 1000);

    // Hash password
    const passwordHash = await bcrypt.hash(
      payload.password,
      PASSWORD_SALT_ROUNDS
    );

    // Store pending registration with OTP info
    await PendingRegistrationModel.create({
      email,
      passwordHash,
      firstName: payload.firstName,
      lastName: payload.lastName,
      otpCodeHash: codeHash,
      otpExpiresAt: expiresAt,
    });

    // Send OTP email
    try {
      await this.emailService.sendOtp(email, code);
    } catch (error) {
      // If email fails, delete the pending registration
      await PendingRegistrationModel.deleteOne({ email });
      console.error("❌ Failed to send OTP email:", error);
      throw new AuthError(500, `Failed to send verification email: ${error instanceof Error ? error.message : String(error)}`);
    }

    return {
      message: "Verification code sent to email",
      requiresVerification: true,
    };
  }

  async verifyOtp(app: FastifyInstance, payload: VerifyOtpInput) {
    const email = payload.email.toLowerCase();
    const codeHash = crypto.createHash("sha256").update(payload.code).digest("hex");

    // Find pending registration
    const pendingRegistration = await PendingRegistrationModel.findOne({ email });
    if (!pendingRegistration) {
      throw new AuthError(404, "No pending registration found. Please sign up again.");
    }

    // Check if OTP is expired
    if (new Date() > pendingRegistration.otpExpiresAt) {
      await PendingRegistrationModel.deleteOne({ email });
      throw new AuthError(400, "OTP has expired. Please sign up again.");
    }

    // Verify OTP code
    if (pendingRegistration.otpCodeHash !== codeHash) {
      throw new AuthError(400, "Invalid verification code");
    }

    // Check if user already exists (race condition check)
    const existing = await UserModel.findOne({ email });
    if (existing) {
      await PendingRegistrationModel.deleteOne({ email });
      throw new AuthError(409, "Account already exists");
    }

    // Create user account
    const user = await UserModel.create({
      email: pendingRegistration.email,
      passwordHash: pendingRegistration.passwordHash,
      firstName: pendingRegistration.firstName,
      lastName: pendingRegistration.lastName,
      isEmailVerified: true,
      otpVerifiedAt: new Date(),
    });

    // Delete pending registration
    await PendingRegistrationModel.deleteOne({ email });

    return {
      user: user.toSafeObject(),
      message: "Account created successfully",
    };
  }
}
