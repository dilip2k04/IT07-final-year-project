import * as service from "./projects.service.js";

/* ======================
   LIST PROJECTS
====================== */
export const listProjects = async (req, res) => {
  const projects = await service.getAllProjects(req.user);
  res.json(projects);
};

/* ======================
   GET PROJECT BY ID ✅ REQUIRED
====================== */
export const getProjectById = async (req, res) => {
  try {
    const project = await service.getProjectById(
      req.params.id,
      req.user
    );
    res.json(project);
  } catch (e) {
    res.status(e.status || 403).json({ message: e.message });
  }
};


/* ======================
   CREATE PROJECT
====================== */
export const create = async (req, res) => {
  try {
    const project = await service.createProject(req.body, req.user);
    res.status(201).json(project);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

/* ======================
   UPDATE PROJECT
====================== */
export const update = async (req, res) => {
  try {
    const project = await service.updateProject(
      req.params.id,
      req.body,
      req.user
    );
    res.json(project);
  } catch (e) {
    res.status(403).json({ message: e.message });
  }
};

/* ======================
   DELETE PROJECT
====================== */
export const remove = async (req, res) => {
  try {
    await service.deleteProject(req.params.id, req.user);
    res.json({ message: "Project deleted" });
  } catch (e) {
    res.status(403).json({ message: e.message });
  }
};
