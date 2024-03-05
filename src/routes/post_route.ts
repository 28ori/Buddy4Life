import express from "express";
import PostController from "../controllers/post_controller";
import authMiddleware from "../authentication/auth_middleware";
import validationMiddleware from "../validations/validation_middleware";
import {
    createPostValidationSchema,
    getPostsValidationSchema,
    postIdValidationSchema,
    updatePostValidationSchema,
} from "../models/post_model";
import { createCommentValidationSchema, commentIdValidationSchema } from "../models/comment_model";

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
 *       required:
 *         - name
 *         - breed
 *         - gender
 *         - age
 *       example:
 *         name: 'Rex'
 *         breed: 'Golden Retriever'
 *         gender: 'male'
 *         age: 3
 *         weight: 30
 *         height: 24
 *         color: 'Golden'
 *
 *     Comment:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *       required:
 *         - text
 *       example:
 *         text: 'This is a comment.'
 *
 *     Post:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the post
 *         description:
 *           type: string
 *           description: Description for the post
 *         dogInfo:
 *           $ref: '#/components/schemas/DogInfo'
 *         city:
 *           type: string
 *       required:
 *         - title
 *         - description
 *         - dogInfo
 *       example:
 *         title: 'My Dog Post'
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
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - title
 *         - ownerId
 *         - description
 *         - dogInfo
 *         - _id
 *         - comments
 *         - createdAt
 *         - updatedAt
 *       example:
 *         title: 'My Dog Post'
 *         ownerId: '65cf6b8a538966718f3e18b2'
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
 *         comments: []
 *         createdAt: '2024-02-17T16:41:40.692Z'
 *         updatedAt: '2024-02-17T16:41:40.692Z'
 *
 *     CreateCommentResponse:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *         authorId:
 *           type: string
 *       required:
 *         - text
 *         - authorId
 *       example:
 *         text: 'This is a comment.'
 *         authorId: '65d0e1a36cca2b99dcc8674e'
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
 *         name: ownerId
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: gender
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: breed
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
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
router.get("", validationMiddleware(getPostsValidationSchema), authMiddleware, PostController.get.bind(PostController));

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
router.get(
    "/:id",
    validationMiddleware(postIdValidationSchema),
    authMiddleware,
    PostController.getById.bind(PostController)
);

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
 *               $ref: '#/components/schemas/crudPostResponse'
 */
router.post(
    "",
    validationMiddleware(createPostValidationSchema),
    authMiddleware,
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
 *           example:
 *             title: 'My Dog Post'
 *             description: 'Sharing my experiences with my dog'
 *             dogInfo:
 *               name: 'Rex'
 *               breed: 'Golden Retriever'
 *               gender: 'male'
 *               age: 3
 *               weight: 30
 *               height: 24
 *               color: 'Golden'
 *             city: 'Dogville'
 *     responses:
 *       200:
 *         description: Successful response of the post update opreation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/crudPostResponse'
 */
router.put(
    "/:id",
    validationMiddleware(updatePostValidationSchema),
    authMiddleware,
    PostController.putById.bind(PostController)
);

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
router.delete(
    "/:id",
    validationMiddleware(postIdValidationSchema),
    authMiddleware,
    PostController.deleteById.bind(PostController)
);

/**
 * @swagger
 * /post/{id}/comment:
 *   post:
 *     summary: Add a new comment to the post
 *     tags: [Posts]
 *     description: Need to provide the refresh token in the auth header in order to create a comment.
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
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Successful response of the new comment creation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateCommentResponse'
 */
router.post(
    "/:id/comment",
    validationMiddleware(createCommentValidationSchema),
    authMiddleware,
    PostController.postComment.bind(PostController)
);

/**
 * @swagger
 * /post/{id}/comment/{commentId}:
 *   put:
 *     summary: Edit a comment in the post
 *     tags: [Posts]
 *     description: Need to provide the refresh token in the auth header in order to edit a comment.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Successful response of the edit comment operation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateCommentResponse'
 */
router.put(
    "/:id/comment/:commentId",
    validationMiddleware(createCommentValidationSchema),
    authMiddleware,
    PostController.putComment.bind(PostController)
);

/**
 * @swagger
 * /post/{id}/comment/{commentId}:
 *   delete:
 *     summary: Delete comment by post id and comment id
 *     tags: [Posts]
 *     description: Need to provide the refresh token in the auth header in order to delete a comment.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response of the delete comment operation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateCommentResponse'
 */
router.delete(
    "/:id/comment/:commentId",
    validationMiddleware(commentIdValidationSchema),
    authMiddleware,
    PostController.deleteComment.bind(PostController)
);

export default router;
