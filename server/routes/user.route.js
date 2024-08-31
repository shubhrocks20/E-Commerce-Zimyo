import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.js";
import router from "./index.js";

const userRouter = router;
userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/verify-email", userController.verifyUser);
userRouter.get("/me", authMiddleware, userController.me);
userRouter.post("/order", authMiddleware, userController.order);
userRouter.get("/order-history", authMiddleware, userController.orderHistory);

export default userRouter;
