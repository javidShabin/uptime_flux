import crypto from "node:crypto";
import { authenticator, totp } from "otplib";
import QRCode from "qrcode";
import type { FastifyInstance } from "fastify";
import { ProfileModel } from "./profile.model.js";
import { ProfileError } from "./profile.errors.js";
import { Types } from "mongoose";
import { env } from "../../config/env.js";

// Set TOTP options for better security
authenticator.options = {
  window: [1, 1], // Accept codes from previous and next time step
  step: 30, // 30-second time step
};

export interface TwoFactorSetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerifyResponse {
  success: boolean;
  backupCodes?: string[];
}

export class TwoFactorService {
  private readonly encryptionKey: string;

  constructor() {
    this.encryptionKey = env.TWO_FACTOR_ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex");
  }

  /**
   * Encrypt 2FA secret before storing
   */
  private encryptSecret(secret: string): string {
    const algorithm = "aes-256-gcm";
    const key = crypto.scryptSync(this.encryptionKey, "salt", 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(secret, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    // Combine IV, authTag, and encrypted data
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  }

  /**
   * Decrypt 2FA secret from storage
   */
  private decryptSecret(encryptedSecret: string): string {
    const algorithm = "aes-256-gcm";
    const key = crypto.scryptSync(this.encryptionKey, "salt", 32);
    const parts = encryptedSecret.split(":");

    if (parts.length !== 3) {
      throw new Error("Invalid encrypted secret format");
    }

    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  /**
   * Generate backup codes for account recovery
   */
  private generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-digit backup codes
      const code = crypto.randomInt(10000000, 99999999).toString();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Hash backup code for storage
   */
  private hashBackupCode(code: string): string {
    return crypto.createHash("sha256").update(code).digest("hex");
  }

  /**
   * Setup 2FA for a user
   */
  async setupTwoFactor(
    app: FastifyInstance,
    userId: string,
    userEmail: string,
    serviceName: string = "UptimeFlux"
  ): Promise<TwoFactorSetupResponse> {
    // Validate ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new ProfileError(400, "Invalid user ID format");
    }

    // Find profile
    const profile = await ProfileModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!profile) {
      throw new ProfileError(404, "Profile not found");
    }

    // Check if 2FA is already enabled
    if (profile.twoFactorEnabled) {
      throw new ProfileError(400, "Two-factor authentication is already enabled");
    }

    // Generate secret
    const secret = authenticator.generateSecret();

    // Encrypt secret before storing
    const encryptedSecret = this.encryptSecret(secret);

    // Generate backup codes
    const backupCodes = this.generateBackupCodes(10);
    const hashedBackupCodes = backupCodes.map((code) => this.hashBackupCode(code));

    // Store encrypted secret and backup codes in Redis temporarily (for verification step)
    const setupKey = `2fa:setup:${userId}`;
    await app.redis.setex(
      setupKey,
      600, // 10 minutes expiry
      JSON.stringify({
        encryptedSecret,
        hashedBackupCodes,
      })
    );

    // Generate QR code
    const otpAuthUrl = authenticator.keyuri(userEmail, serviceName, secret);
    const qrCode = await QRCode.toDataURL(otpAuthUrl);

    return {
      secret, // Return plain secret for QR code generation (will be verified before saving)
      qrCode,
      backupCodes, // Return plain backup codes (user should save these)
    };
  }

  /**
   * Verify and enable 2FA
   */
  async verifyTwoFactor(
    app: FastifyInstance,
    userId: string,
    token: string
  ): Promise<TwoFactorVerifyResponse> {
    // Validate ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new ProfileError(400, "Invalid user ID format");
    }

    // Find profile
    const profile = await ProfileModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!profile) {
      throw new ProfileError(404, "Profile not found");
    }

    // Check if 2FA is already enabled
    if (profile.twoFactorEnabled) {
      throw new ProfileError(400, "Two-factor authentication is already enabled");
    }

    // Get setup data from Redis
    const setupKey = `2fa:setup:${userId}`;
    const setupDataStr = await app.redis.get(setupKey);

    if (!setupDataStr) {
      throw new ProfileError(400, "2FA setup session expired. Please start setup again.");
    }

    const setupData = JSON.parse(setupDataStr);
    const { encryptedSecret, hashedBackupCodes } = setupData;

    // Decrypt secret
    const secret = this.decryptSecret(encryptedSecret);

    // Verify token
    const isValid = authenticator.verify({ token, secret });

    if (!isValid) {
      throw new ProfileError(400, "Invalid verification code");
    }

    // Save encrypted secret to profile
    profile.twoFactorSecretEncrypted = encryptedSecret;
    profile.twoFactorEnabled = true;
    await profile.save();

    // Store backup codes in Redis (hashed)
    const backupCodesKey = `2fa:backup:${userId}`;
    await app.redis.setex(backupCodesKey, 0, JSON.stringify(hashedBackupCodes)); // 0 = no expiry

    // Clean up setup session
    await app.redis.del(setupKey);

    return {
      success: true,
    };
  }

  /**
   * Verify 2FA token for login/authentication
   */
  async verifyToken(app: FastifyInstance, userId: string, token: string): Promise<boolean> {
    // Validate ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new ProfileError(400, "Invalid user ID format");
    }

    // Find profile
    const profile = await ProfileModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!profile) {
      throw new ProfileError(404, "Profile not found");
    }

    // Check if 2FA is enabled
    if (!profile.twoFactorEnabled || !profile.twoFactorSecretEncrypted) {
      throw new ProfileError(400, "Two-factor authentication is not enabled");
    }

    // Decrypt secret
    const secret = this.decryptSecret(profile.twoFactorSecretEncrypted);

    // Verify token
    const isValid = authenticator.verify({ token, secret });

    if (isValid) {
      return true;
    }

    // If TOTP fails, check backup codes
    const backupCodesKey = `2fa:backup:${userId}`;
    const backupCodesStr = await app.redis.get(backupCodesKey);

    if (backupCodesStr) {
      const hashedBackupCodes: string[] = JSON.parse(backupCodesStr);
      const tokenHash = this.hashBackupCode(token);

      const codeIndex = hashedBackupCodes.indexOf(tokenHash);
      if (codeIndex !== -1) {
        // Remove used backup code
        hashedBackupCodes.splice(codeIndex, 1);
        await app.redis.setex(backupCodesKey, 0, JSON.stringify(hashedBackupCodes));

        return true;
      }
    }

    return false;
  }

  /**
   * Disable 2FA
   */
  async disableTwoFactor(app: FastifyInstance, userId: string, token: string): Promise<void> {
    // Validate ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new ProfileError(400, "Invalid user ID format");
    }

    // Find profile
    const profile = await ProfileModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!profile) {
      throw new ProfileError(404, "Profile not found");
    }

    // Check if 2FA is enabled
    if (!profile.twoFactorEnabled) {
      throw new ProfileError(400, "Two-factor authentication is not enabled");
    }

    // Verify token before disabling
    const isValid = await this.verifyToken(app, userId, token);
    if (!isValid) {
      throw new ProfileError(400, "Invalid verification code");
    }

    // Disable 2FA
    profile.twoFactorEnabled = false;
    profile.twoFactorSecretEncrypted = null;
    await profile.save();

    // Remove backup codes from Redis
    const backupCodesKey = `2fa:backup:${userId}`;
    await app.redis.del(backupCodesKey);
  }

  /**
   * Check if 2FA is enabled for a user
   */
  async isTwoFactorEnabled(userId: string): Promise<boolean> {
    // Validate ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return false;
    }

    const profile = await ProfileModel.findOne({ userId: new Types.ObjectId(userId) })
      .select("twoFactorEnabled")
      .lean();

    return profile?.twoFactorEnabled || false;
  }
}

