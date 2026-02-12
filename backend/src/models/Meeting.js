import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    link: { type: String, required: true },
    regarding: String,

    startTime: Date,
    endTime: Date,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    allowedUsers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    allowedDepartments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Department" }
    ],

    roleScope: {
      type: String, // ALL | DEPARTMENT | PROJECT | SPECIFIC
    }
  },
  { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);
