import * as service from "./users.service.js";

export const listUsers = async (req, res) => {
  const users = await service.getAllUsers();
  res.json(users);
};

export const create = async (req, res) => {
  try {
    const user = await service.createUser(req.body, req.user);
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const update = async (req, res) => {
  const user = await service.updateUser(req.params.id, req.body);
  res.json(user);
};

export const remove = async (req, res) => {
  await service.deleteUser(req.params.id);
  res.json({ message: "User deleted" });
};
