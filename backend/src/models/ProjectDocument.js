import mongoose from "mongoose";

const ProjectDocumentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    originalName: String,

    fileName: String,

    filePath: String,

    mimeType: String,

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "ProjectDocument",
  ProjectDocumentSchema
);
