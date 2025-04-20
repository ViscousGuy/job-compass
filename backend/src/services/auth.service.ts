import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env.config.js";
import User, { IUser } from "../models/user.model.js";
import { RegisterInput } from "../validators/auth.validator.js";

export const authService = {
  register: async (
    userData: RegisterInput
  ): Promise<{ user: IUser; token: string }> => {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create new user
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      password: hashedPassword,
      company: userData.company,
    });

    // Generate JWT token
    // @ts-ignore
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    // Remove password from response
    // @ts-ignore
    user.password = undefined;
    return { user, token };
  },
  login: async (userData: {
    email: string;
    password: string;
  }): Promise<{ user: IUser; token: string }> => {
    // Find user by email
    const user = await User.findOne({ email: userData.email }).select(
      "+password"
    );

    // Check if user exists
    if (!user) {
      throw new Error("User not found");
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      userData.password,
      user.password as string
    );

    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    // @ts-ignore
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    // Remove password from response
    // @ts-ignore
    user.password = undefined;
    return { user, token };
  },
};
