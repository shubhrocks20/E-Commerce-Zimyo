import createHttpError from "http-errors";
import Joi from "joi";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendVerificationEmail from "../services/nodemailer.js";
import { JWT_SECRET } from "../config/index.js";

const userController = {
  async register(req, res, next) {
    const RegisterSchema = Joi.object({
      name: Joi.string().trim().required().messages({
        "string.empty": "Name is required.",
      }),
      email: Joi.string()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .required()
        .messages({
          "string.pattern.base": "Please provide a valid email address.",
          "string.empty": "Email is required.",
        }),
      password: Joi.string()
        .min(8)
        .regex(/[A-Z]/, "uppercase")
        .regex(/[a-z]/, "lowercase")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "special character")
        .required()
        .messages({
          "string.min": "Password must be at least 8 characters long.",
          "string.pattern.name": "Password must contain at least one {#name}.",
          "string.empty": "Password is required.",
        }),
    });
    const { error } = RegisterSchema.validate(req.body);
    if (error) {
      return next(createHttpError(400, error.message));
    }
    const { name, email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (user) {
        return next(
          createHttpError(400, "User already exists with this email")
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const emailToken = jwt.sign({ email: email }, JWT_SECRET);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        verificationCode: emailToken,
      });
      const savedUser = await newUser.save();

      await sendVerificationEmail(savedUser, emailToken);

      res.json({ message: "Success" });
    } catch (err) {
      return next(createHttpError(500, err.message));
    }
  },
  async verifyUser(req, res, next) {
    const token = req.query.token;

    try {
      const user = await User.findOne({ verificationCode: token });

      if (!user) {
        return res.status(400).send("Invalid token");
      }

      user.isVerified = true;
      user.verificationCode = undefined; // Clear the token after verification
      await user.save();

      res.send("Email verified successfully. You can now log in.");
    } catch (error) {
      res.status(500).send("Server error");
    }
  },
  async login(req, res, next) {
    const LoginSchema = Joi.object({
      email: Joi.string()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .required()
        .messages({
          "string.pattern.base": "Please provide a valid email address.",
          "string.empty": "Email is required.",
        }),
      password: Joi.string().required().messages({
        "string.empty": "Password is required.",
      }),
    });

    const { error } = LoginSchema.validate(req.body);
    if (error) {
      return next(createHttpError(400, error.message));
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return next(createHttpError(400, "Invalid email or password"));
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return next(createHttpError(400, "Invalid email or password"));
      }

      if (!user.isVerified) {
        return next(createHttpError(400, "Please verify your email first"));
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: "10h",
      });

      res.json({ message: "Login successful", token });
    } catch (err) {
      return next(createHttpError(500, err.message));
    }
  },
};
export default userController;
