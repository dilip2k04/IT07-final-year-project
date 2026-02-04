import Department from "../../models/Department.js";

export const list = () => Department.find().populate("head", "name");
export const create = (d) => Department.create(d);
export const update = (id, d) => Department.findByIdAndUpdate(id, d, { new: true });
export const remove = (id) => Department.findByIdAndDelete(id);
