import Project from "../../models/Project.js";
import ProjectDocument from "../../models/ProjectDocument.js";

const canAccessProject = (project, user) => {
  if (user.role === "CEO") return true;

  if (
    user.role === "DEPARTMENT_HEAD" &&
    project.departmentId.toString() === user.departmentId.toString()
  )
    return true;

  if (
    user.role === "TEAM_LEAD" &&
    project.teamLeadId.toString() === user._id.toString()
  )
    return true;

  if (
    user.role === "EMPLOYEE" &&
    project.employees.some(
      (e) => e.toString() === user._id.toString()
    )
  )
    return true;

  return false;
};

/* ======================
   LIST DOCUMENTS
====================== */
export const listDocuments = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  if (!canAccessProject(project, user))
    throw new Error("Forbidden");

  return ProjectDocument.find({ projectId })
    .populate("uploadedBy", "name")
    .sort({ createdAt: -1 });
};

/* ======================
   UPLOAD DOCUMENT
====================== */
export const uploadDocument = async (
  projectId,
  file,
  user
) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  if (!canAccessProject(project, user))
    throw new Error("Forbidden");

  return ProjectDocument.create({
    projectId,
    originalName: file.originalname,
    fileName: file.filename,
    filePath: file.path,
    mimeType: file.mimetype,
    uploadedBy: user._id,
  });
};
