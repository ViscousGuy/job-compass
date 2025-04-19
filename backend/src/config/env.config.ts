import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define environment variable interface
interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_COOKIE_EXPIRES_IN: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLIENT_URL: string;
}

// Required environment variables
const requiredEnvVars: (keyof EnvConfig)[] = ["MONGO_URI", "JWT_SECRET"];
// Check for required environment variables
const checkEnv = (): void => {
  const missing = requiredEnvVars.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
    process.exit(1);
  }
};

// Create and export config object
export const config: EnvConfig = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-should-be-in-env",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "90d",
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN || "90",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

export { checkEnv };
