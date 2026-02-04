import * as service from "./tasks.service.js";

export const create = async (req, res) => {
  try {
    const task = await service.createTask(req.body, req.user);
    res.status(201).json(task);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const projectTasks = async (req, res) => {
  try {
    const tasks = await service.getTasksByProject(
      req.params.projectId,
      req.user
    );
    res.json(tasks);
  } catch (e) {
    res.status(403).json({ message: e.message });
  }
};

export const myTasks = async (req, res) => {
  try {
    const tasks = await service.getMyTasks(req.user);
    res.json(tasks);
  } catch (e) {
    res.status(403).json({ message: e.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const task = await service.updateTaskStatus(
      req.params.id,
      req.body.status,
      req.user
    );
    res.json(task);
  } catch (e) {
    res.status(403).json({ message: e.message });
  }
};
