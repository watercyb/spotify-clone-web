import { Server } from "socket.io";
import { verifyToken } from "@clerk/backend";
import { User } from "../models/user_model.js";
import { Message } from "../models/message_model.js";

export const initialSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  const userSocketIds = new Map();
  const userActivities = new Map();

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return;

    try {
      const res = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      const user = await User.findOne({ clerkId: res.sub });
      if (!user) return;

      socket.user = user;
      next();
    } catch (error) {
      console.error("Socket token verification failed:", error);
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.user._id;
    console.log("connected:", socket.id + " " + userId);
    userSocketIds.set(userId.toString(), socket.id);
    userActivities.set(userId, "Idle");

    io.emit("user_connected", userId);
    socket.emit("user", socket.user);
    socket.emit("users_online", Array.from(userSocketIds.keys()));
    socket.emit("activities", Array.from(userActivities.entries()));

    socket.on("update_activity", (activity) => {
      userActivities.set(userId, activity);
      io.emit("activity_updated", { userId, activity });
    });

    socket.on("send_message", async (data) => {
      try {
        const { receiverId, content } = data;
        const message = await Message.create({
          senderId: userId,
          receiverId,
          content,
        });

        if (userSocketIds.has(receiverId)) {
          const receiverSocketId = userSocketIds.get(receiverId);
          io.to(receiverSocketId).emit("receive_message", message);
        }

        socket.emit("receive_message", message);
      } catch (error) {
        console.error("socket send_message error: ", error);
        socket.emit("message_error", error.message);
      }
    });

    socket.on("disconnect", () => {
      userSocketIds.delete(userId);
      userActivities.delete(userId);
      io.emit("user_disconnected", userId);
      console.log("disconnected: " + socket.id + " " + userId);
    });
  });
};
