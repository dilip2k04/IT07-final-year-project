import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    link: { type: String, required: true },
    timings: { type: Date, required: true },
    regarding: String,

    allowedUsers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],

    allowedDepartments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);
