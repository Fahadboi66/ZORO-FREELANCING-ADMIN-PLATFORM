import { Notification } from "../Models/notification.model.js";
import { User } from "../Models/user.model.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";


export const sendNotification = asyncHandler(async (req, res) => {
    const { email, message } = req.body;
  
    if (!email || !message) {
      throw new ErrorHandler(400, "email and message are required.");
    }
    const user = await User.findOne({email})
    const notification = await Notification.create({ userId: user._id, message });
  
    return res.status(201).json(
      new ApiResponseHandler(201, notification, "Notification sent successfully.")
    );
  });
  