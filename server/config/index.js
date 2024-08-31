import dotenv, { config } from "dotenv";

config();
export const {
  PORT,
  BACKEND_DOMAIN,
  JWT_SECRET,
  EMAIL_USER,
  EMAIL_PASS,
  MONGO_URI,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  CLOUD_NAME,
} = process.env;
