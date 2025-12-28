import bcrypt from "bcrypt";
import { User } from "@uptimeflux/shared";
import type { RegisterInput, LoginInput } from "./auth.types";

/**
 * AuthService
 *
 * Handles core authentication logic:
 * - User registration
 * - User login
 *
 * No HTTP logic. No JWT yet.
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash user passowrd with salt rounds
    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create new user
    const user = await User.create({
      email,
      passwordHash,
    });

    // If complete the user creation return the user
    return {
      id: user._id.toString(),
      email: user.email,
      createdAt: user.createdAt,
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

    return {
      id: user._id.toString(),
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
