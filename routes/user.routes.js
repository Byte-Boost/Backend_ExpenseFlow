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

