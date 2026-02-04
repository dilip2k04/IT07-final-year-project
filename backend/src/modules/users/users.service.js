import User from "../../models/User.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async () => {
  return User.find().select("-password").populate("departmentId", "name");
};

export const createUser = async (data, creator) => {
  const { name, email, password, role, departmentId } = data;

  // CEO can create anyone
  if (creator.role !== "CEO") {
    throw new Error("Only CEO can create users");
  }

  // Department required for all except CEO
  if (role !== "CEO" && !departmentId) {
    throw new Error("Department is required");
  }

  const exists = await User.findOne({ email });
  if (exists) throw new Error("User already exists");

  const hash = await bcrypt.hash(password, 10);

  return User.create({
    name,
    email,
    password: hash,
    role,
    departmentId: role === "CEO" ? null : departmentId,
  });
};


export const updateUser = async (id, data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return User.findByIdAndUpdate(id, data, { new: true }).select("-password");
};

export const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};
