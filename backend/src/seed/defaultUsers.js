import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { ROLES } from "../utils/roles.js";

export const seedDefaultUsers = async () => {
  const users = [
    {
      name: "CEO User",
      email: "ceo@company.com",
      password: "ceo123",
      role: ROLES.CEO,
    },
    {
      name: "Department Head",
      email: "head@company.com",
      password: "head123",
      role: ROLES.DEPARTMENT_HEAD,
    },
    {
      name: "Manager User",
      email: "manager@company.com",
      password: "manager123",
      role: ROLES.MANAGER,
    },
    {
      name: "Team Lead",
      email: "tl@company.com",
      password: "tl123",
      role: ROLES.TEAM_LEAD,
    },
    {
      name: "Employee User",
      email: "employee@company.com",
      password: "emp123",
      role: ROLES.EMPLOYEE,
    },
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({
        name: u.name,
        email: u.email,
        password: hashed,
        role: u.role,
      });
      console.log(`👤 Created user: ${u.email}`);
    }
  }
};
