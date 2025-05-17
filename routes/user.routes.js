const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

router.post("/register", adminMiddleware, userController.registerUser);
router.post("/login", userController.loginUser);
router.put("/subscribe", adminMiddleware, userController.subscribeToProjects);
router.put("/unsubscribe", adminMiddleware, userController.unsubscribeFromProjects);
router.put("/setSubscriptions", adminMiddleware, userController.setUserSubscribedProjects);

router.get("/", authMiddleware, adminMiddleware, userController.getUsers);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
*/

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad Request - missing or invalid fields
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Unauthorized - invalid credentials
 */

/**
 * @swagger
 * /users/subscribe:
 *   put:
 *     tags: [Users]
 *     summary: Subscribe user to projects
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectIds
 *             properties:
 *               projectIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: User subscribed to projects successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User subscribed to projects
 *       400:
 *         description: Bad Request
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users/unsubscribe:
 *   put:
 *     tags: [Users]
 *     summary: Unsubscribe user from projects
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectIds
 *             properties:
 *               projectIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *     responses:
 *       200:
 *         description: User unsubscribed from projects successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User unsubscribed from projects
 *       400:
 *         description: Bad Request
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
