import mongoose from "mongoose";
import { config } from "./env.config.js";

// Database connection function
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Unknown error occurred while connecting to MongoDB");
    }
    process.exit(1);
  }
};
