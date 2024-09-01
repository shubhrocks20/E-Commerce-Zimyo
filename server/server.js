import express from "express";
import { PORT } from "./config/index.js";
import userRouter from "./routes/user.route.js";
import connectDB from "./config/dbConnection.js";
import productRouter from "./routes/product.route.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

connectDB();
app.listen(PORT, () => {
  console.log(`Listening to PORT = ${PORT}`);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: err.message,
  });
});
