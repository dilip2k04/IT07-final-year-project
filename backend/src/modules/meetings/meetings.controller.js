import Meeting from "../../models/Meeting.js";

/* ======================================================
   ✅ CREATE MEETING
====================================================== */
export const createMeeting = async (req, res) => {
  try {
    const user = req.user;

    const {
      name,
      link,
      regarding,
      startTime,
      endTime,
      allowedUsers = [],
      allowedDepartments = [],
    } = req.body;

    // 🔐 Role restrictions
    if (user.role === "DEPARTMENT_HEAD") {
      allowedDepartments.push(user.departmentId);
    }

    const meeting = await Meeting.create({
      name,
      link,
      regarding,
      startTime,
      endTime,
      createdBy: user._id,
      allowedUsers,
      allowedDepartments,
    });

    res.json(meeting);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


/* ======================================================
   ✅ LIST MY MEETINGS  ⭐ (YOU MISSED THIS)
====================================================== */
export const listMyMeetings = async (req, res) => {
  try {
    const user = req.user;

    const meetings = await Meeting.find({
      $or: [
        { allowedUsers: user._id },
        { allowedDepartments: user.departmentId },
      ],
    })
      .populate("createdBy", "name")
      .sort({ startTime: 1 });

    res.json(meetings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


/* ======================================================
   ⭐ LIST ALL MEETINGS (for CRUD page)
====================================================== */
export const listMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate("createdBy", "name")
      .sort({ startTime: 1 });

    res.json(meetings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* ======================================================
   UPDATE
====================================================== */
export const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(meeting);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


/* ======================================================
   DELETE
====================================================== */
export const deleteMeeting = async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ message: "Meeting deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
