import expess from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import fileUpload from "express-fileupload";

import user_route from "./routes/user_route.js";
import auth_route from "./routes/auth_route.js";
import admin_route from "./routes/admin_route.js";
import song_route from "./routes/song_route.js";
import album_route from "./routes/album_route.js";
import stat_route from "./routes/stat_route.js";
import { connectDB } from "./lib/db.js";
import { cloudinaryConfig } from "./lib/cloudinary.js";
import { deleteAlbum } from "./controller/admin_controller.js";

const app = expess();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

dotenv.config();
const port = process.env.PORT;

app.use(clerkMiddleware());

app.use(expess.json());

app.use("/api/users", user_route);
app.use("/api/auth", auth_route);
app.use("/api/admin", admin_route);
app.use("/api/songs", song_route);
app.use("/api/albums", album_route);
app.use("/api/stats", stat_route);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(port, () => {
  console.log("Running on port: " + port);
  connectDB();
  cloudinaryConfig();
});
