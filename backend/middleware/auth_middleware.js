import { clerkClient } from "@clerk/express";
import { User } from "../models/user_model.js";

export const protectRoute = async (req, res, next) => {
  if (!req.auth().userId) {
    res.status(401).json({ message: "Unauthorized - you must be logged in." });
  } else {
    const user = await User.findOne({ clerkId: req.auth().userId });
    //TODO check user?
    req.user = user;
    next();
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth().userId);
    const isAdmin =
      process.env.AMMIN_EMAIL === currentUser.emailAddresses[0]?.emailAddress;

    if (!isAdmin) {
      res.status(401).json({ message: "Unauthorized - you must be an admin." });
    } else {
      next();
    }
  } catch (error) {
    console.long("Error in auth middelware: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
