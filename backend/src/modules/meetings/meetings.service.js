export const getUserMeetings = async (user) => {
  const filter = {
    $or: [
      { allowedUsers: user._id },
      { allowedDepartments: user.departmentId },
      { roleScope: "ALL" }
    ]
  };

  return Meeting.find(filter)
    .populate("createdBy", "name")
    .sort({ startTime: 1 });
};
