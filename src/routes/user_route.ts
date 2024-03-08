import express from "express";
import userController from "../controllers/user_controller";
import authMiddleware from "../authentication/auth_middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
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
 *     getUserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lasName:
 *           type: string
 *         imageUrl:
 *           type: string
 *       required:
 *         - _id
 *         - email
 *         - firstName
 *         - lasName
 *       example:
 *         _id: '65d082ed9a155e7b8da0c2db'
 *         email: Bob@gmail.com
 *         firstName: Bob
 *         lasName: Chase
 *         imageUrl: 'http://host/url/to/image'
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user details
 *     tags: [User]
 *     description: Need to provide the refresh token in the auth header in order to get user details.
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
 *         description: Successful response of the get user details operation.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/getUserResponse'
 */
router.get("/:id", authMiddleware, userController.getById.bind(userController));

router.put("/:id", authMiddleware, userController.putById.bind(userController));

router.delete("/:id", authMiddleware, userController.deleteById.bind(userController));

export default router;
