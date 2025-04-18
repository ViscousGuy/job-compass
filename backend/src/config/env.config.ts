import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define environment variable interface
interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  MONGO_URI: string;
}

// Required environment variables
const requiredEnvVars: (keyof EnvConfig)[] = ["MONGO_URI"];

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
};

export { checkEnv };
