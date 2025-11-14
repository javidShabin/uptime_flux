import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { FastifyInstance } from "fastify";
import { env } from "../../config/env.js";
import { UserModel, type UserDocument, type SafeUser } from "./auth.model.js";
import { OtpModel, OtpType } from "./otp.model.js";
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
    const existing = await UserModel.findOne({ email });

    if (existing) throw new AuthError(409, "Account already exists");

    const passwordHash = await bcrypt.hash(
      payload.password,
      PASSWORD_SALT_ROUNDS
    );
    const user = await UserModel.create({
      email,
      passwordHash,
      firstName: payload.firstName,
      lastName: payload.lastName,
    });

    await this.issueOtp(email, OtpType.EMAIL_VERIFICATION);

    return {
      user: user.toSafeObject(),
      requiresVerification: true,
      message: "Verification code sent to email",
    };
  }
}
