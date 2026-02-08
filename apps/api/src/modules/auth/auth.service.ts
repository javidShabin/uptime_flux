import bcrypt from "bcrypt";
import { User, generateOTP, sendOtpEmail } from "@uptimeflux/shared";
import { signJwt } from "../../utils/jwt.js";
import type { RegisterInput, LoginInput, VerifyEmailInput } from "./auth.types.js";
import crypto from "crypto";

/**
 * AuthService
 *
 * Handles core authentication logic:
 * - User registration
 * - User login
 *
 */

export class AuthService {
  private readonly SALT_ROUNDS = 10;

  // ==============================
  // Register
  // ==============================
  async register(input: RegisterInput) {
    // Destructer datas from input
    const { email, password } = input;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Check any user is exise with same email
    const existingUser = await User.findOne({ email, isEmailVerified: true });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash user passowrd with salt rounds
    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    const { otp, hash, expire } = generateOTP();
    console.log(otp, hash, expire, "otp details");

    // Create new user
    const user = await User.create({
      email,
      passwordHash,
      emailOTPHash: hash,
      emailOTPExpiresAt: new Date(expire),
      isEmailVerified: false,
    });

    await sendOtpEmail(email, otp);

    const OTP_MESSAGE = "An OTP has been sent to your email for verification."; 

    // If complete the user creation return the user
    return {
      id: user._id.toString(),
      email: user.email,
      needsEmailVerification: true,
      OTP_MESSAGE,
    }
  }

  // ==============================
  // Login
  // ==============================
  async verifyEmail(input: VerifyEmailInput) {
    const { email, otp } = input;
    // hash the otp using crypto
    const hash = crypto.createHash("sha256").update(otp).digest("hex");

    // Find user by email and hashed OTP
    const user = await User.findOne({
      email,
      emailOTPHash: hash,
      emailOTPExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      throw new Error("Invalid OTP or OTP expired");
    }

    // Update the emial and otp fields after verifying the otp
    user.isEmailVerified = true;
    user.emailOTPHash = "";
    user.emailOTPExpiresAt = new Date();

    await user.save();

    // Generate token for authenticated user after successful email verification
    const token = signJwt({
      userId: user._id.toString(),
    });

    const SUCCESS_MESSAGE = "Email verified successfully.";

    return {
      verified: true,
      SUCCESS_MESSAGE,
      user: {
        id: user._id.toString(),
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        token,
      },
    };
    
  }

  // ==============================
  // Login
  // ==============================
  async login(input: LoginInput) {
    // Destructer the login detail
    const { email, password } = input;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      throw new Error("Invalid credentials");
    }

    const token = signJwt({
      userId: user._id.toString(),
    });

    return {
      id: user._id.toString(),
      email: user.email,
      createdAt: user.createdAt,
      token,
    };
  }
}
