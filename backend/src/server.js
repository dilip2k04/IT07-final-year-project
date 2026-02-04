import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
// import { seedDefaultUsers } from "./seed/defaultUsers.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // await seedDefaultUsers();

    app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://192.168.1.3:${PORT}`);
  });

  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
