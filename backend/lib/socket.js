import { Server } from "socket.io";
import { verifyToken } from "@clerk/backend";
import { User } from "../models/user_model.js";

export const initialSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  const socketIds = new Map();
  const userToSocketIds = new Map();

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
    } catch (err) {
      console.error("Socket token verification failed:", err);
    }
  });

  io.on("connection", async (socket) => {
    console.log("connected:", socket.id);

    socket.on("action_change", () => {});

    socket.on("send_message", () => {});

    socket.on("get_message", () => {});

    socket.on("disconnect", (reason) => {
      console.log("disconnected: " + socket.id);
    });
  });
};
