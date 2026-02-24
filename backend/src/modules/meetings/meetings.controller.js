import Meeting from "../../models/Meeting.js";

/* ======================================================
   CREATE MEETING
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
      allowedDepartments = []
    } = req.body;

    const meeting = await Meeting.create({
      name,
      link,
      regarding,
      startTime,
      endTime,
      createdBy: user._id,
      allowedUsers,         // 🔥 ONLY this controls visibility
      allowedDepartments    // UI purpose only
    });

    const populatedMeeting = await Meeting.findById(meeting._id)
      .populate("createdBy", "name role")
      .populate("allowedUsers", "name role")
      .populate("allowedDepartments", "name");

    res.json(populatedMeeting);

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


/* ======================================================
   LIST MEETINGS
   - CEO → See all
   - Others → ONLY meetings where they are in allowedUsers
====================================================== */
export const listMeetings = async (req, res) => {
  try {
    const user = req.user;

    let filter = {};

    // 🔥 Strict filtering
    if (user.role !== "CEO") {
      filter = {
        allowedUsers: user._id
      };
    }

    const meetings = await Meeting.find(filter)
      .populate("createdBy", "name role")
      .populate("allowedUsers", "name role")
      .populate("allowedDepartments", "name")
      .sort({ startTime: 1 });

    res.json(meetings);

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


/* ======================================================
   UPDATE MEETING
   - Only creator or CEO
====================================================== */
export const updateMeeting = async (req, res) => {
  try {
    const user = req.user;

    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    if (
      user.role !== "CEO" &&
      meeting.createdBy.toString() !== user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("createdBy", "name role")
      .populate("allowedUsers", "name role")
      .populate("allowedDepartments", "name");

    res.json(updated);

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


/* ======================================================
   DELETE MEETING
   - Only creator or CEO
====================================================== */
export const deleteMeeting = async (req, res) => {
  try {
    const user = req.user;

    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    if (
      user.role !== "CEO" &&
      meeting.createdBy.toString() !== user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Meeting.findByIdAndDelete(req.params.id);

    res.json({ message: "Meeting deleted" });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};