import userController from "../controllers/user.controller.js";
import router from "./index.js";

const userRouter = router;
userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/verify-email", userController.verifyUser);

export default userRouter;
