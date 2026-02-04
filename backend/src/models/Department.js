import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  head: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Department", departmentSchema);
  