import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth_middleware.js";
import { getAllAlbums, getAlbumById } from "../controller/album_controller.js";

const router = Router();

router.get("/", protectRoute, requireAdmin, getAllAlbums);
router.get("/:id", getAlbumById);

export default router;
