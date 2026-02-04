import Task from "../../models/Task.js";
import Project from "../../models/Project.js";

/* ======================
   CREATE TASK (TL)
====================== */
export const createTask = async (data, user) => {
  if (user.role !== "TEAM_LEAD")
    throw new Error("Only Team Lead can create tasks");

  const { title, projectId, assignedTo, dueDate } = data;

  if (!title || !projectId || !assignedTo)
    throw new Error("Missing required fields");

  const project = await Project.findById(projectId);
  if (!project) throw new Error("Invalid project");

  if (project.teamLeadId.toString() !== user._id.toString())
    throw new Error("Not your project");

  return Task.create({
    title,
    projectId,
    assignedTo,
    assignedBy: user._id,
    dueDate,
  });
};

/* ======================
   TL → PROJECT TASKS
====================== */
export const getTasksByProject = async (projectId, user) => {
  if (user.role !== "TEAM_LEAD")
    throw new Error("Unauthorized");

  return Task.find({ projectId })
    .populate("assignedTo", "name")
    .populate("assignedBy", "name");
};

/* ======================
   EMPLOYEE → MY TASKS
====================== */
export const getMyTasks = async (user) => {
  if (user.role !== "EMPLOYEE")
    throw new Error("Unauthorized");

  return Task.find({ assignedTo: user._id })
    .populate("projectId", "name")
    .populate("assignedBy", "name");
};

/* ======================
   EMPLOYEE → UPDATE STATUS
====================== */
export const updateTaskStatus = async (id, status, user) => {
  const task = await Task.findById(id);
  if (!task) throw new Error("Task not found");

  if (task.assignedTo.toString() !== user._id.toString())
    throw new Error("Not your task");

  task.status = status;
  await task.save();

  return task;
};
