import express from "express";
import PostController from "../controllers/post_controller";
import authMiddleware from "../authentication/auth_middleware";

const router = express.Router();

router.get("/", authMiddleware, PostController.get.bind(PostController));

router.get("/:id", authMiddleware, PostController.getById.bind(PostController));

router.post("/", authMiddleware, PostController.post.bind(PostController));

router.put("/:id", authMiddleware, PostController.putById.bind(PostController));

router.delete("/:id", authMiddleware, PostController.deleteById.bind(PostController));

export default router;
