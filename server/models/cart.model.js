import mongoose, { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
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

export const Cart = mongoose.model("Cart", cartSchema);
