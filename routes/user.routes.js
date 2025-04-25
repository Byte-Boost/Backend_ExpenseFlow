const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const authMiddleware = require('../middleware/auth.middleware');

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.put("/subscribe", authMiddleware, userController.subscribeToProjects);
router.put("/unsubscribe", authMiddleware, userController.unsubscribeFromProjects);

module.exports = router;

