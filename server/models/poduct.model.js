import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    Image: {
      type: String,
      default: "https://rb.gy/w3jq7t",
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
