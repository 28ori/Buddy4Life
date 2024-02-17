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
 *     Category:
 *       type: string
 *       enum:
 *         - adopt
 *         - rehome
 *       description: The category of the post
 *
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
 *           $ref: '#/components/schemas/Category'
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
 *
 *
 *     crudPostResponse:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the post
 *         ownerId:
 *           type: string
 *           description: The user id of the owner of the post
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         description:
 *           type: string
 *           description: Description for the post
 *         dogInfo:
 *           $ref: '#/components/schemas/DogInfo'
 *         city:
 *           type: string
 *         _id:
 *           type: string
 *           description: ID of the newly created post
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - title
 *         - ownerId
 *         - category
 *         - description
 *         - _id
 *         - createdAt
 *         - updatedAt
 *       example:
 *         title: 'My Dog Post'
 *         ownerId: '65cf6b8a538966718f3e18b2'
 *         category: 'rehome'
 *         description: 'Sharing my experiences with my dog'
 *         dogInfo:
 *           name: 'Rex'
 *           breed: 'Golden Retriever'
 *           gender: 'male'
 *           age: 3
 *           weight: 30
 *           height: 24
 *           color: 'Golden'
 *         city: 'Dogville'
 *         _id: '65d082ed9a155e7b8da0c2db'
 *         createdAt: '2024-02-17T16:41:40.692Z'
 *         updatedAt: '2024-02-17T16:41:40.692Z'
 */

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get posts
 *     tags: [Posts]
 *     description: Need to provide the refresh token in the auth header in order to get posts.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           $ref: '#/components/schemas/Category'
 *       - in: query
 *         name: ownerId
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response of the get posts operation.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/crudPostResponse'
 */
router.get("", authMiddleware, PostController.get.bind(PostController));

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a single post by id
 *     tags: [Posts]
 *     description: Need to provide the refresh token in the auth header in order to get a post.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response of the get post by id operation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/crudPostResponse'
 */
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
 *           examples:
 *             rehome:
 *               value:
 *                 title: 'My Dog Post'
 *                 category: 'rehome'
 *                 description: 'Sharing my experiences with my dog'
 *                 dogInfo:
 *                   name: 'Rex'
 *                   breed: 'Golden Retriever'
 *                   gender: 'male'
 *                   age: 3
 *                   weight: 30
 *                   height: 24
 *                   color: 'Golden'
 *                 city: 'Dogville'
 *             adopt:
 *               value:
 *                 title: 'My Dog Post'
 *                 category: 'adopt'
 *                 description: 'Sharing my experiences with my dog'
 *                 dogInfo:
 *                   breed: 'Golden Retriever'
 *                   gender: 'female'
 *                 city: 'Dogville'
 *     responses:
 *       200:
 *         description: Successful response of the new post creation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/crudPostResponse'
 */
router.post(
    "",
    authMiddleware,
    validationMiddleware(createPostValidationSchema),
    PostController.post.bind(PostController)
);

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     description: Need to provide the refresh token in the auth header in order to update a post.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *           examples:
 *             rehome:
 *               value:
 *                 title: 'My Dog Post'
 *                 category: 'rehome'
 *                 description: 'Sharing my experiences with my dog'
 *                 dogInfo:
 *                   name: 'Rex'
 *                   breed: 'Golden Retriever'
 *                   gender: 'male'
 *                   age: 3
 *                   weight: 30
 *                   height: 24
 *                   color: 'Golden'
 *                 city: 'Dogville'
 *             adopt:
 *               value:
 *                 title: 'My Dog Post'
 *                 category: 'adopt'
 *                 description: 'Sharing my experiences with my dog'
 *                 dogInfo:
 *                   breed: 'Golden Retriever'
 *                   gender: 'female'
 *                 city: 'Dogville'
 *     responses:
 *       200:
 *         description: Successful response of the post update opreation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/crudPostResponse'
 */
router.put("/:id", authMiddleware, PostController.putById.bind(PostController));

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Delete post by id
 *     tags: [Posts]
 *     description: Need to provide the refresh token in the auth header in order to delete a post.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response of the delete post by id operation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/crudPostResponse'
 */
router.delete("/:id", authMiddleware, PostController.deleteById.bind(PostController));

export default router;
