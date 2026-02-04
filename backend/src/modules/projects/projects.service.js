import Project from "../../models/Project.js";
import User from "../../models/User.js";
import Department from "../../models/Department.js";

/* ======================
   LIST PROJECTS
====================== */
export const getAllProjects = async (user) => {
  const filter = {};

  if (user.role === "DEPARTMENT_HEAD") {
    filter.departmentId = user.departmentId;
  }

  if (user.role === "TEAM_LEAD") {
    filter.teamLeadId = user._id;
  }

  if (user.role === "EMPLOYEE") {
    filter.employees = user._id;
  }

  return Project.find(filter)
    .populate("departmentId", "name")
    .populate("departmentHeadId", "name")
    .populate("teamLeadId", "name")
    .populate("employees", "name");
};

/* ======================
   GET PROJECT BY ID
====================== */
export const getProjectById = async (projectId, user) => {
  const project = await Project.findById(projectId)
    .populate("employees", "name")
    .populate("teamLeadId", "name")
    .populate("departmentId", "name");

  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    throw err;
  }

  // ===== ROLE-BASED ACCESS CHECK =====
  if (user.role === "CEO") return project;

  if (
    user.role === "DEPARTMENT_HEAD" &&
    project.departmentId._id.toString() ===
      user.departmentId.toString()
  ) {
    return project;
  }

  if (
    user.role === "TEAM_LEAD" &&
    project.teamLeadId?._id.toString() === user._id.toString()
  ) {
    return project;
  }

  if (
    user.role === "EMPLOYEE" &&
    project.employees.some(
      (e) => e._id.toString() === user._id.toString()
    )
  ) {
    return project;
  }

  const err = new Error("Forbidden");
  err.status = 403;
  throw err;
};




/* ======================
   CREATE PROJECT
====================== */
export const createProject = async (data, user) => {
  if (!["CEO", "DEPARTMENT_HEAD"].includes(user.role)) {
    throw new Error("Only CEO or Department Head can create projects");
  }

  const { name, teamLeadId, employees = [] } = data;
  if (!name || !teamLeadId) {
    throw new Error("Name & Team Lead are required");
  }

  const departmentId =
    user.role === "DEPARTMENT_HEAD" ? user.departmentId : data.departmentId;

  if (!departmentId) throw new Error("Department is required");

  const dept = await Department.findById(departmentId);
  if (!dept) throw new Error("Invalid Department");

  const tl = await User.findById(teamLeadId);
  if (!tl || tl.role !== "TEAM_LEAD")
    throw new Error("Invalid Team Lead");

  if (tl.departmentId.toString() !== departmentId.toString())
    throw new Error("Team Lead must belong to same department");

  for (const empId of employees) {
    const emp = await User.findById(empId);
    if (!emp || emp.role !== "EMPLOYEE")
      throw new Error("Invalid employee");

    if (emp.departmentId.toString() !== departmentId.toString())
      throw new Error("Employee must belong to same department");
  }

  return Project.create({
    name,
    departmentId,
    departmentHeadId:
      user.role === "DEPARTMENT_HEAD" ? user._id : null,
    teamLeadId,
    employees,
  });
};

/* ======================
   UPDATE PROJECT
====================== */
export const updateProject = async (id, data, user) => {
  const project = await Project.findById(id);
  if (!project) throw new Error("Project not found");

  // 🚫 prevent department switching by DH
  if (user.role === "DEPARTMENT_HEAD") {
    if (
      project.departmentId.toString() !== user.departmentId.toString()
    )
      throw new Error("Unauthorized");

    delete data.departmentId;
  }

  if (user.role !== "CEO" && user.role !== "DEPARTMENT_HEAD") {
    throw new Error("Unauthorized");
  }

  return Project.findByIdAndUpdate(id, data, { new: true })
    .populate("departmentId", "name")
    .populate("departmentHeadId", "name")
    .populate("teamLeadId", "name")
    .populate("employees", "name");
};

/* ======================
   DELETE PROJECT
====================== */
export const deleteProject = async (id, user) => {
  const project = await Project.findById(id);
  if (!project) throw new Error("Project not found");

  if (user.role === "CEO") {
    await Project.findByIdAndDelete(id);
    return;
  }

  if (
    user.role === "DEPARTMENT_HEAD" &&
    project.departmentId.toString() === user.departmentId.toString()
  ) {
    await Project.findByIdAndDelete(id);
    return;
  }

  throw new Error("Unauthorized");
};
