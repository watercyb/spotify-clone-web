import { Router } from "express";
import { getAllUsers ,getMessages} from "../controller/user_controller.js";
import { protectRoute } from "../middleware/auth_middleware.js";

const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:receiverId", protectRoute, getMessages);

export default router;
