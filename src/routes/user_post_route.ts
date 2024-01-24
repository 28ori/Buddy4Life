import express from "express";
const router = express.Router();
import userPostController from "../controllers/user_post_controller";
import authMiddleware from "../authentication/auth_middleware";


router.get("/", authMiddleware, userPostController.get.bind(userPostController));

router.get("/:id", authMiddleware, userPostController.getById.bind(userPostController));

router.post("/", authMiddleware, userPostController.post.bind(userPostController));

router.put("/:id", authMiddleware, userPostController.putById.bind(userPostController));

router.delete("/:id", authMiddleware, userPostController.deleteById.bind(userPostController));

export default router;