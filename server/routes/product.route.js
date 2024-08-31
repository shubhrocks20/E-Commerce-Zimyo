import router from "./index.js";
import productController from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const productRouter = router;

productRouter.post(
  "/create",
  [
    authMiddleware,
    upload.fields([
      {
        name: "image",
        maxCount: 1,
      },
    ]),
  ],

  productController.createProduct
);

productRouter.get('/list-products', productController.getAllProduct)

export default productRouter;
