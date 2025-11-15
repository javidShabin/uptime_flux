import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { FastifyInstance } from "fastify";
import { env } from "../../config/env.js";
import { UserModel, type UserDocument, type SafeUser, type RefreshTokenEntity } from "./auth.model.js";
import { OtpModel, OtpType } from "./otp.model.js";
import { PendingRegistrationModel } from "./pending-registration.model.js";
import { EmailService } from "./email.service.js";
import { AuthError } from "./auth.errors.js";
import type {
  RegisterInput,
  LoginInput,
  VerifyOtpInput,
  ResendOtpInput,
  RefreshInput,
  ForgotPasswordInput,
  VerifyForgotPasswordOtpInput,
  ResetPasswordInput,
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

  async login(app: FastifyInstance, payload: LoginInput): Promise<{ user: SafeUser; tokens: AuthTokens }> {
    const email = payload.email.toLowerCase();

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) throw new AuthError(401, "Invalid email or password");

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(payload.password);
    if (!isPasswordCorrect) throw new AuthError(401, "Invalid email or password");

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new AuthError(403, "Email not verified. Please verify your email first.");
    }

    // Generate access token
    const userId = String(user._id);
    const accessToken = app.jwt.sign({ userId });

    // Generate refresh token
    const refreshTokenId = crypto.randomUUID();
    const refreshToken = jwt.sign(
      { userId, tokenId: refreshTokenId },
      env.JWT_REFRESH_SECRET,
      { expiresIn: `${this.refreshTokenTtlSeconds}s` }
    );

    // Hash refresh token for storage
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    // Store refresh token in user document
    const refreshTokenEntity: RefreshTokenEntity = {
      tokenId: refreshTokenId,
      tokenHash: refreshTokenHash,
      expiresAt: refreshTokenExpiresAt,
      createdAt: new Date(),
    };

    // Add new refresh token and limit history
    user.refreshTokens.push(refreshTokenEntity);
    if (user.refreshTokens.length > REFRESH_TOKEN_HISTORY_LIMIT) {
      // Remove oldest tokens (keep only the last N)
      user.refreshTokens = user.refreshTokens
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, REFRESH_TOKEN_HISTORY_LIMIT);
    }

    // Update last login time
    user.lastLoginAt = new Date();

    // Save user
    await user.save();

    return {
      user: user.toSafeObject(),
      tokens: {
        accessToken,
        refreshToken,
        refreshTokenId,
        refreshTokenExpiresAt,
      },
    };
  }

  async resendOtp(app: FastifyInstance, payload: ResendOtpInput) {
    const email = payload.email.toLowerCase();

    // Find pending registration
    const pendingRegistration = await PendingRegistrationModel.findOne({ email });
    if (!pendingRegistration) {
      throw new AuthError(404, "No pending registration found. Please sign up again.");
    }

    // Check resend interval - prevent spam
    const timeSinceLastUpdate = Date.now() - pendingRegistration.updatedAt.getTime();
    const resendIntervalMs = env.OTP_RESEND_INTERVAL_SECONDS * 1000;
    
    if (timeSinceLastUpdate < resendIntervalMs) {
      const remainingSeconds = Math.ceil((resendIntervalMs - timeSinceLastUpdate) / 1000);
      throw new AuthError(429, `Please wait ${remainingSeconds} seconds before requesting a new code.`);
    }

    // Generate new OTP
    const code = crypto.randomInt(100000, 999999).toString();
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRATION_MINUTES * 60 * 1000);

    // Update pending registration with new OTP
    pendingRegistration.otpCodeHash = codeHash;
    pendingRegistration.otpExpiresAt = expiresAt;
    await pendingRegistration.save();

    // Send new OTP email
    try {
      await this.emailService.sendOtp(email, code);
    } catch (error) {
      console.error("❌ Failed to send OTP email:", error);
      throw new AuthError(500, `Failed to send verification email: ${error instanceof Error ? error.message : String(error)}`);
    }

    return {
      message: "Verification code resent to email",
    };
  }

  async logout(app: FastifyInstance, refreshToken: string, userId: string) {
    // Find user
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AuthError(404, "User not found");
    }

    // Hash the refresh token to find it in the database
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    // Find and revoke the refresh token
    const tokenIndex = user.refreshTokens.findIndex(
      (token) => token.tokenHash === refreshTokenHash && !token.revokedAt
    );

    if (tokenIndex !== -1) {
      // Mark token as revoked
      user.refreshTokens[tokenIndex].revokedAt = new Date();
      await user.save();
    }

    return {
      message: "Logged out successfully",
    };
  }

  async refresh(app: FastifyInstance, payload: RefreshInput): Promise<{ accessToken: string; refreshToken?: string; refreshTokenExpiresAt?: Date }> {
    const refreshToken = payload.refreshToken;
    if (!refreshToken) {
      throw new AuthError(400, "Refresh token is required");
    }

    // Verify refresh token
    let decoded: { userId: string; tokenId: string };
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string; tokenId: string };
    } catch (error) {
      throw new AuthError(401, "Invalid or expired refresh token");
    }

    // Find user with refresh tokens
    const user = await UserModel.findById(decoded.userId).select("refreshTokens");
    if (!user) {
      throw new AuthError(404, "User not found");
    }

    // Hash the refresh token to find it in the database
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    // Find the refresh token in user's tokens
    const tokenEntity = user.refreshTokens.find(
      (token) => token.tokenHash === refreshTokenHash && !token.revokedAt
    );

    if (!tokenEntity) {
      throw new AuthError(401, "Refresh token not found or revoked");
    }

    // Check if token is expired
    if (new Date() > tokenEntity.expiresAt) {
      // Remove expired token
      user.refreshTokens = user.refreshTokens.filter(
        (token) => token.tokenHash !== refreshTokenHash
      );
      await user.save();
      throw new AuthError(401, "Refresh token has expired");
    }

    // Generate new access token
    const userId = String(user._id);
    const accessToken = app.jwt.sign({ userId });

    // Rotate refresh token for security (generate new one)
    const newRefreshTokenId = crypto.randomUUID();
    const newRefreshToken = jwt.sign(
      { userId, tokenId: newRefreshTokenId },
      env.JWT_REFRESH_SECRET,
      { expiresIn: `${this.refreshTokenTtlSeconds}s` }
    );

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    const newRefreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    // Remove old token and add new one
    user.refreshTokens = user.refreshTokens.filter(
      (token) => token.tokenHash !== refreshTokenHash
    );

    const newRefreshTokenEntity: RefreshTokenEntity = {
      tokenId: newRefreshTokenId,
      tokenHash: newRefreshTokenHash,
      expiresAt: newRefreshTokenExpiresAt,
      createdAt: new Date(),
    };

    user.refreshTokens.push(newRefreshTokenEntity);

    // Limit token history
    if (user.refreshTokens.length > REFRESH_TOKEN_HISTORY_LIMIT) {
      user.refreshTokens = user.refreshTokens
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, REFRESH_TOKEN_HISTORY_LIMIT);
    }

    await user.save();

    return {
      accessToken,
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt: newRefreshTokenExpiresAt,
    };
  }

  async forgotPassword(app: FastifyInstance, payload: ForgotPasswordInput) {
    const email = payload.email.toLowerCase();

    // Check if user exists
    const user = await UserModel.findOne({ email }).lean().select("_id email");
    if (!user) {
      // Don't reveal if user exists for security
      return {
        message: "If an account exists with this email, a password reset code has been sent.",
      };
    }

    // Check if email is verified
    const userWithVerification = await UserModel.findOne({ email }).select("isEmailVerified");
    if (!userWithVerification?.isEmailVerified) {
      throw new AuthError(403, "Email not verified. Please verify your email first.");
    }

    // Generate and send OTP for password reset
    await this.issueOtp(email, OtpType.PASSWORD_RESET);

    return {
      message: "If an account exists with this email, a password reset code has been sent.",
    };
  }

  async verifyForgotPasswordOtp(app: FastifyInstance, payload: VerifyForgotPasswordOtpInput) {
    const email = payload.email.toLowerCase();
    const codeHash = crypto.createHash("sha256").update(payload.code).digest("hex");
    const now = new Date();

    // Find and verify OTP
    const otp = await OtpModel.findOne({
      email,
      type: OtpType.PASSWORD_RESET,
      codeHash,
      expiresAt: { $gt: now },
    }).lean();

    if (!otp) {
      // Check if OTP exists but is wrong/expired
      const exists = await OtpModel.findOne({ email, type: OtpType.PASSWORD_RESET }).lean().select("expiresAt");
      if (exists) {
        if (new Date() > exists.expiresAt) {
          throw new AuthError(400, "Verification code has expired. Please request a new one.");
        }
        throw new AuthError(400, "Invalid verification code");
      }
      throw new AuthError(404, "No password reset request found. Please request a new password reset.");
    }

    // Verify user exists
    const user = await UserModel.findOne({ email }).lean().select("_id");
    if (!user) {
      throw new AuthError(404, "User not found");
    }

    return {
      message: "Verification code is valid. You can now reset your password.",
    };
  }

  async resetPassword(app: FastifyInstance, payload: ResetPasswordInput) {
    const email = payload.email.toLowerCase();
    const codeHash = crypto.createHash("sha256").update(payload.code).digest("hex");
    const now = new Date();

    // Find and verify OTP
    const otp = await OtpModel.findOne({
      email,
      type: OtpType.PASSWORD_RESET,
      codeHash,
      expiresAt: { $gt: now },
    });

    if (!otp) {
      // Check if OTP exists but is wrong/expired
      const exists = await OtpModel.findOne({ email, type: OtpType.PASSWORD_RESET }).lean().select("expiresAt");
      if (exists) {
        if (new Date() > exists.expiresAt) {
          throw new AuthError(400, "Verification code has expired. Please request a new one.");
        }
        throw new AuthError(400, "Invalid verification code");
      }
      throw new AuthError(404, "No password reset request found. Please request a new password reset.");
    }

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new AuthError(404, "User not found");
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(payload.newPassword, PASSWORD_SALT_ROUNDS);

    // Update password
    user.passwordHash = newPasswordHash;
    await user.save();

    // Delete OTP after successful password reset
    await OtpModel.deleteOne({ email, type: OtpType.PASSWORD_RESET });

    // Revoke all refresh tokens for security
    user.refreshTokens = [];
    await user.save();

    return {
      message: "Password has been reset successfully. Please login with your new password.",
    };
  }
}
