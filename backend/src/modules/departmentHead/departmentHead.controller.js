import User from "../../models/User.js";
import Project from "../../models/Project.js";
import Department from "../../models/Department.js";
import Task from "../../models/Task.js"; // ⭐ ADD THIS

export const getDepartmentHeadDashboard = async (req, res) => {
  try {
    const departmentHead = req.user;

    if (!departmentHead?.departmentId) {
      return res.status(400).json({
        message: "Department Head has no department assigned",
      });
    }

    const departmentId = departmentHead.departmentId;

    /* ============================
       BASIC COUNTS
    ============================ */
    const [department, teamLeads, employees, projectsList] =
      await Promise.all([
        Department.findById(departmentId).lean(),

        User.countDocuments({
          role: "TEAM_LEAD",
          departmentId,
        }),

        User.countDocuments({
          role: "EMPLOYEE",
          departmentId,
        }),

        Project.find({ departmentId }).select("_id"),
      ]);

    /* ============================
       🔥 DERIVE PROJECT STATUS FROM TASKS
    ============================ */
    let notStarted = 0;
    let inProgress = 0;
    let completed = 0;
    let blocked = 0;

    for (const p of projectsList) {
      const tasks = await Task.find({ projectId: p._id });

      if (!tasks.length) {
        notStarted++;
        continue;
      }

      const done = tasks.filter(t => t.status === "DONE").length;
      const hasBlocked = tasks.some(t => t.status === "BLOCKED");

      if (hasBlocked) blocked++;
      else if (done === 0) notStarted++;
      else if (done === tasks.length) completed++;
      else inProgress++;
    }

    res.json({
      department,
      teamLeads,
      employees,
      projects: {
        total: projectsList.length,
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
