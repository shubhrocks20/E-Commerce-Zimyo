import createHttpError from "http-errors";
import Joi from "joi";
import uploadOnCloudinary from "../services/cloudinary.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";

const productController = {
  async createProduct(req, res, next) {
    const productSchema = Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      description: Joi.string().required(),
    });

    const { error } = productSchema.validate(req.body);
    if (error) {
      return next(createHttpError(400, error.message));
    }

    const { name, price, description } = req.body;

    let imageUrl;
    if (req.files && req.files.image && req.files.image[0]) {
      try {
        const imageFile = req.files.image[0];
        imageUrl = await uploadOnCloudinary(imageFile.buffer);
      } catch (error) {
        return next(createHttpError(500, "Error uploading image"));
      }
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(createHttpError(403, "Not authorized to create product"));
      }

      const newProductData = {
        name,
        price,
        description,
        owner: req.user.id,
        ...(imageUrl && { image: imageUrl }),
      };

      const newProduct = new Product(newProductData);
      const savedProduct = await newProduct.save();

      res.status(201).json({
        message: "Product created successfully!",
        product: savedProduct,
      });
    } catch (error) {
      return next(createHttpError(500, error.message));
    }
  },
  async getAllProduct(req, res, next) {
    try {
      const products = await Product.find().select("-__v ");
      if (!products) {
        return next(createHttpError(404, "No product found!"));
      }
      res.json(products);
    } catch (err) {
      return next(createHttpError(500, "Internal Server Error"));
    }
  },
};

export default productController;
