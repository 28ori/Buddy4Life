import express from "express";
import authController from "../controllers/auth_controller";
import validationMiddleware from "../validations/validation_middleware";
import { createUserValidationSchema, userCredentialsValidationSchema } from "../models/user_model";
import { authValidationSchema } from "../models/authentication_model";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The Authentication API
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
 *     UserCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *       example:
 *         email: 'bob@gmail.com'
 *         password: '123456'
 *
 *     User:
 *       allOf:
 *         - $ref: '#/components/schemas/UserCredentials'
 *         - type: object
 *           properties:
 *             firstName:
 *               type: string
 *               description: The user first name
 *             lastName:
 *               type: string
 *               description: The user last name
 *           required:
 *             - firstName
 *             - lastName
 *           example:
 *             email: 'bob@gmail.com'
 *             password: '123456'
 *             firstName: 'Bob'
 *             lastName: 'Chase'
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

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successful response of the new user registration.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/registerUserResponse'
 */
router.post("/register", validationMiddleware(createUserValidationSchema), authController.register);

/**
 * @swagger
 * components:
 *   schemas:
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The JWT access token
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 *       example:
 *         accessToken: "123cd123x1xx1"
 *         refreshToken: "134r2134cr1x3c"
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       200:
 *         description: Successful response of the user login operation, the access & refresh tokens are returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 */
router.post("/login", validationMiddleware(userCredentialsValidationSchema), authController.login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Authentication]
 *     description: Need to provide the refresh token in the auth header in order to logout a user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response of the user logout operation
 */
router.get("/logout", validationMiddleware(authValidationSchema), authController.logout);

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Refresh a user token
 *     tags: [Authentication]
 *     description: Need to provide the refresh token in the auth header in order to refresh user token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response of the refresh user token operation
 */
router.get("/refresh", validationMiddleware(authValidationSchema), authController.refresh);

export default router;
