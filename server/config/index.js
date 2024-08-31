import dotenv, { config } from "dotenv";

config();
export const {
  PORT,
  BACKEND_DOMAIN,
  JWT_SECRET,
  EMAIL_USER,
  EMAIL_PASS,
  MONGO_URI,
} = process.env;
