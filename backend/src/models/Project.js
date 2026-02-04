import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    departmentHeadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    teamLeadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /* ======================
       ✅ NEW STATUS FIELD
    ====================== */
    status: {
      type: String,
      enum: [
        "NOT_STARTED",
        "IN_PROGRESS",
        "COMPLETED",
        "BLOCKED",
      ],
      default: "NOT_STARTED",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", ProjectSchema);
