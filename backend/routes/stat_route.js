import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth_middleware.js";
import { getStats } from "../controller/stat_controller.js";

const router = Router();

router.get("/", protectRoute, requireAdmin, getStats);

export default router;
