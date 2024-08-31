import express from "express";
import { PORT } from "./config/index.js";
import userRouter from "./routes/user.route.js";
import connectDB from "./config/dbConnection.js";
import productRouter from "./routes/product.route.js";

const app = express();

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

connectDB();
app.listen(PORT, () => {
  console.log(`Listening to PORT = ${PORT}`);
});
