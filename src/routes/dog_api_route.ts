import express from "express";
const router = express.Router();
import dogApiController from "../controllers/dog_api_controller";
// import authMiddleware from "../authentication/auth_middleware";


router.get("/", dogApiController.get.bind(dogApiController));

router.get("/:id", dogApiController.getById.bind(dogApiController));

// router.post("/", authMiddleware, userPostController.post.bind(userPostController));

// router.put("/:id", authMiddleware, userPostController.putById.bind(userPostController));

// router.delete("/:id", authMiddleware, userPostController.deleteById.bind(userPostController));

export default router;