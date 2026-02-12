import Meeting from "../../models/Meeting.js";

/* =============================
   CREATE MEETING
============================= */
export const createMeeting = async (req, res) => {
  try {
    const user = req.user;
    const data = req.body;

    /* ROLE RULES */

    if (user.role === "DEPARTMENT_HEAD") {
      data.allowedDepartments = [user.departmentId];
    }

    if (user.role === "TEAM_LEAD") {
      data.allowedUsers = [user._id];
    }

    const meeting = await Meeting.create({
      ...data,
      createdBy: user._id,
    });

    res.json(meeting);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =============================
   GET MY MEETINGS
============================= */
export const getMyMeetings = async (req, res) => {
  try {
    const user = req.user;

    const meetings = await Meeting.find({
      $or: [
        { allowedUsers: user._id },
        { allowedDepartments: user.departmentId },
        { createdBy: user._id },
      ],
    })
      .populate("allowedUsers", "name")
      .populate("allowedDepartments", "name");

    res.json(meetings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =============================
   DELETE
============================= */
export const removeMeeting = async (req, res) => {
  await Meeting.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
