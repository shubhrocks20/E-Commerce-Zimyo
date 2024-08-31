import createHttpError from "http-errors";
import Joi from "joi";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendVerificationEmail from "../services/nodemailer.js";
import { JWT_SECRET } from "../config/index.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

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

      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: "10h",
      });

      res.json({ message: "Login successful", token });
    } catch (err) {
      return next(createHttpError(500, err.message));
    }
  },
  async me(req, res, next) {
    const { email, id } = req.user;

    try {
      const user = await User.findOne({
        $or: [{ email: email }, { _id: id }],
      }).select("-__v -password");
      if (!user) {
        return next(customErrorHandler.notFound("No user found!"));
      }
      return res.json(user);
    } catch (error) {
      return next(error);
    }
  },
  async order(req, res, next) {
    const { id, email } = req.user;
    const orderSchema = Joi.object({
      items: Joi.array()
        .items(
          Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().min(1).required(),
            purchaseAtPrice: Joi.number().required(),
          })
        )
        .min(1)
        .required(),
      shippingAddress: Joi.string().required(),
    });

    const { error } = orderSchema.validate(req.body);
    if (error) {
      return next(createHttpError(400, error.message));
    }
    try {
      const user = await User.findOne({
        $or: [{ email: email }, { _id: id }],
      }).select("-__v -password");
      if (!user) {
        return next(customErrorHandler.notFound("No user found!"));
      }

      const { items, shippingAddress } = req.body;
      // Create the order
      const newOrder = new Order({
        userId: req.user.id,
        items,
        shippingAddress,
      });
      const savedOrder = await newOrder.save();

      res.status(201).json({ message: "Order placed successfully!" });
    } catch (error) {
      return next(error);
    }
  },
  async orderHistory(req, res, next) {
    const { email, id } = req.user;

    try {
      const orders = await Order.find({ userId: id });
      if (!orders) {
        return next(createHttpError(404, "No orders found!"));
      }
      res.json(orders);
    } catch (err) {
      return next(createHttpError(500, "Internal Server Error"));
    }
  },
};
export default userController;
