import { Router } from "express";
import { getAllUsers } from "../controller/user_controller.js";
import { protectRoute } from "../middleware/auth_middleware.js";

const router = Router();

router.get("/", protectRoute, getAllUsers);

export default router;
