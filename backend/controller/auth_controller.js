import { User } from "../models/user_model.js";
import { clerkClient } from "@clerk/express";

export const authCallback = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);

      await User.create({
        clerkId: clerkUser.id,
        fullName: `${clerkUser.firstName} ${clerkUser.lastName}`,
        imageUrl: clerkUser.imageUrl,
      });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next("Error in auth_controller authCallback: " + error);
  }
};
