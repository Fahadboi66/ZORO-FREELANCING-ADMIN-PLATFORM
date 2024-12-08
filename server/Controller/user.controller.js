import { User } from "../Models/user.model.js";
import { Notification } from "../Models/notification.model.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";

export const getAllUser = asyncHandler(async (req, res) => {
  // Fetch users where role is either 'freelancer' or 'client', excluding 'admin'
  const usersList = await User.find({
    role: { $in: ["freelancer", "client"] }, // filter by 'freelancer' or 'client' roles
  });


  if (usersList.length < 0) {
    throw new ErrorHandler(404, "No users found");
  }

  return res
    .status(201)
    .json(new ApiResponseHandler(200, usersList, "User list fetched successfully."));
});

export const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
console.log(req.body)
  // Validate required fields
  if (!firstName || !lastName || !email || !password || !role) {
    throw new ErrorHandler(400, "Please provide all required fields.");
  }

  // Check for valid role
  const validRoles = ["freelancer", "client"];
  if (!validRoles.includes(role)) {
    throw new ErrorHandler(
      400,
      "Invalid role. Allowed roles are 'freelancer' or 'client'."
    );
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ErrorHandler(409, "User with this email already exists.");
  }

  // Create new user
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
  });

  if (!newUser) {
    throw new ErrorHandler(
      500,
      "Failed to create user. Please try again later."
    );
  }

  return res
    .status(201)
    .json(new ApiResponseHandler(201, newUser, "User created successfully."));
});

export const searchUsers = asyncHandler(async (req, res) => {
  const { query, role } = req.query;

  // Build search criteria
  const searchCriteria = {
    $or: [
      { firstName: { $regex: query, $options: "i" } },
      { lastName: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  };

  if (role) {
    searchCriteria.role = role;
  }

  // Search users
  const users = await User.find(searchCriteria);

  if (!users.length) {
    throw new ErrorHandler(404, "No users found matching the criteria.");
  }

  return res
    .status(200)
    .json(new ApiResponseHandler(200, users, "Users retrieved successfully."));
});

export const updateUserInfo = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, role } = req.body;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ErrorHandler(404, "User not found.");
  }

  // Update user fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (role) {
    const validRoles = ["freelancer", "client"];
    if (!validRoles.includes(role)) {
      throw new ErrorHandler(
        400,
        "Invalid role. Allowed roles are 'freelancer', or 'client'."
      );
    }
    user.role = role;
  }

  await user.save();

  return res
    .status(200)
    .json(new ApiResponseHandler(200, user, "User updated successfully."));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ErrorHandler(404, "User not found.");
  }

  // Delete user
  await user.deleteOne();

  return res
    .status(200)
    .json(new ApiResponseHandler(200, null, "User deleted successfully."));
});

export const changeUserProfileStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body; // "active" or "suspended"

  // Validate the status
  if (!["active", "suspended"].includes(status)) {
    throw new ErrorHandler(
      400,
      "Invalid status. It must be either 'active' or 'suspended'."
    );
  }

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    throw new ErrorHandler(404, "User not found.");
  }

  // Update the user's profile status
  user.status = status;
  await user.save();

  // Create a notification message based on the new status
  const notificationMessage = `Your account status has been changed to "${status}".`;

  // Create and save notification for the user
  const notification = new Notification({
    userId: user._id,
    message: notificationMessage,
  });
  await notification.save();

  return res
    .status(200)
    .json(
      new ApiResponseHandler(
        200,
        user,
        `User status changed to ${status} and notification sent.`
      )
    );
});


export const getUserProfile = asyncHandler(async(req, res) => {
  const userProfile = await User.findById({_id: req.user._id});

  if(!userProfile || userProfile === undefined || userProfile === null) {
    throw new ErrorHandler(404, "User Not found");
  };

  return res
  .status(200)
  .json(
    new ApiResponseHandler(
      200,
      userProfile,
      `User Profile Fetched Successfully`
    )
  );


})
