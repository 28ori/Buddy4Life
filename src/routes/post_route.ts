import express from "express";
import PostController from "../controllers/post_controller";
import authMiddleware from "../authentication/auth_middleware";
import validationMiddleware from "../validations/validation_middleware";
import { createPostValidationSchema } from "../models/post_model";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DogInfo:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         breed:
 *           type: string
 *         gender:
 *           type: string
 *         age:
 *           type: number
 *         weight:
 *           type: number
 *         height:
 *           type: number
 *         color:
 *           type: string
 *       example:
 *         name: 'Rex'
 *         breed: 'Golden Retriever'
 *         gender: 'male'
 *         age: 3
 *         weight: 30
 *         height: 24
 *         color: 'Golden'
 *
 *     Post:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the post
 *         category:
 *           type: string
 *           description: The category of the post
 *         description:
 *           type: string
 *           description: Description for the post
 *         dogInfo:
 *           $ref: '#/components/schemas/DogInfo'
 *         city:
 *           type: string
 *       required:
 *         - title
 *         - category
 *         - description
 *       example:
 *         title: 'My Dog Post'
 *         category: 'Pet Care'
 *         description: 'Sharing my experiences with my dog'
 *         dogInfo:
 *           name: 'Rex'
 *           breed: 'Golden Retriever'
 *           gender: 'Male'
 *           age: 3
 *           weight: 30.5
 *           height: 24.5
 *           color: 'Golden'
 *         city: 'Dogville'
 *
 *     registerUserResponse:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         refreshTokens:
 *           type: array
 *           items:
 *             type: string
 *         _id:
 *           type: string
 *       example:
 *         email: "bob13@gmail.com"
 *         firstName: "Bob"
 *         lastName: "Chase"
 *         refreshTokens: []
 *         _id: "65cf49715229fd10a22292ec"
 */

router.get("/", authMiddleware, PostController.get.bind(PostController));

router.get("/:id", authMiddleware, PostController.getById.bind(PostController));

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     description: Need to provide the refresh token in the auth header in order to create a post.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Successful response of the new post creation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/registerUserResponse'
 */
router.post(
    "",
    authMiddleware,
    validationMiddleware(createPostValidationSchema),
    PostController.post.bind(PostController)
);

router.put("/:id", authMiddleware, PostController.putById.bind(PostController));

router.delete("/:id", authMiddleware, PostController.deleteById.bind(PostController));

export default router;
