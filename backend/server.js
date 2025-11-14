import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import path from "path";
import cors from "cors";
import fileUpload from "express-fileupload";
import http from "http";

import user_route from "./routes/user_route.js";
import auth_route from "./routes/auth_route.js";
import admin_route from "./routes/admin_route.js";
import song_route from "./routes/song_route.js";
import album_route from "./routes/album_route.js";
import stat_route from "./routes/stat_route.js";
import { connectDB } from "./lib/db.js";
import { cloudinaryConfig } from "./lib/cloudinary.js";
import { initialSocket } from "./lib/socket.js";

const __dirname = path.resolve();
const app = express();
const server = http.createServer(app);

initialSocket(server);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB  max file size
    },
  })
);

dotenv.config();
const port = process.env.PORT;

app.use(clerkMiddleware());

app.use(express.json());

app.use("/api/users", user_route);
app.use("/api/auth", auth_route);
app.use("/api/admin", admin_route);
app.use("/api/songs", song_route);
app.use("/api/albums", album_route);
app.use("/api/stats", stat_route);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "./frontend/dist")));
	app.get(new RegExp(".*"), (req, res) => {
		res.sendFile(path.resolve(__dirname, "./frontend", "dist", "index.html"));
	});
}

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "Internal server error." });
});

server.listen(port, () => {
  console.log("Running on port: " + port);
  connectDB();
  cloudinaryConfig();
});
