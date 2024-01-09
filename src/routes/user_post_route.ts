import express from "express";
const router = express.Router();
import userPostController from "../controllers/user_post_controller";

router.get("/", userPostController.get.bind(userPostController));

router.get("/:id", userPostController.getById.bind(userPostController));

router.post("/",  userPostController.post.bind(userPostController));

router.put("/:id", userPostController.putById.bind(userPostController));

router.delete("/:id", userPostController.deleteById.bind(userPostController));

export default router;