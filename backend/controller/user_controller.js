import { Message } from "../models/message_model.js";
import { User } from "../models/user_model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const { user } = req;
    const users = await User.find({ _id: { $ne: user._id } }).sort({
      fullName: 1,
    });
    res.status(200).json(users);
  } catch (error) {
    next("Error in user_controller getAllUsers: " + error);
  }
};

export const getMessages=async (req, res, next) => {
  try {
    const { user, receiverId } = req;
    const messages = await Message.find({
			$or: [
				{ senderId: user, receiverId: receiverId },
				{ senderId: receiverId, receiverId: user },
			],
		}).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    next("Error in user_controller getMessages: " + error);
  }
};

