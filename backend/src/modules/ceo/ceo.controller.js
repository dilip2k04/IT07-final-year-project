import User from "../../models/User.js";
import Project from "../../models/Project.js";
import Department from "../../models/Department.js";

export const getCeoDashboard = async (req, res) => {
  try {
    const [
      departments,
      teamLeads,
      employees,
      totalProjects,
      notStarted,
      inProgress,
      completed,
      blocked,
    ] = await Promise.all([
      Department.countDocuments(),

      User.countDocuments({ role: "TEAM_LEAD" }),

      User.countDocuments({ role: "EMPLOYEE" }),

      Project.countDocuments(),

      Project.countDocuments({ status: "NOT_STARTED" }),
      Project.countDocuments({ status: "IN_PROGRESS" }),
      Project.countDocuments({ status: "COMPLETED" }),
      Project.countDocuments({ status: "BLOCKED" }),
    ]);

    res.json({
      departments,
      teamLeads,
      employees,
      projects: {
        total: totalProjects,
        notStarted,
        inProgress,
        completed,
        blocked,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
