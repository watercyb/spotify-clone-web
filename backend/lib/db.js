import mongoose from "mongoose";
import { User } from "../models/user_model.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB: ", conn.connection.host);
  } catch (error) {
    console.log("Failed to connect to MongoDB: ", error);
  }
};
