import mongoose from "mongoose";
import { ROLES } from "../utils/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },

    // 🔥 Who this user reports to
    reportsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
