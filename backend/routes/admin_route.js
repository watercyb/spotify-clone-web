import { Router } from "express";
import {
  createSong,
  deleteSong,
  createAlbum,
  deleteAlbum,
  checkAdmin,
} from "../controller/admin_controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth_middleware.js";

const router = Router();

router.use(protectRoute, requireAdmin);

router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);
router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

router.get("/check", checkAdmin);

export default router;
