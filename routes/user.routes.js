const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

router.post("/register", adminMiddleware, userController.registerUser);
router.post("/login", userController.loginUser);
router.put("/subscribe", authMiddleware, userController.subscribeToProjects);
router.put("/unsubscribe", authMiddleware, userController.unsubscribeFromProjects);

router.get("/", authMiddleware, adminMiddleware, userController.getUsers);

module.exports = router;

