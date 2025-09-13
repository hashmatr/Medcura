import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/UserRoutes.js";
import paymentRouter from "./routes/PaymentRoute.js";

const app = express();

// Connect DB & Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/payment", paymentRouter);

// Test route
app.get("/", (req, res) => {
  res.send("✅ API is working on Vercel!");
});

// ❌ REMOVE app.listen
// ✅ Instead export the app
export default app;
