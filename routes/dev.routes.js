const express = require("express");
const router = express.Router();
const controller = require("../controllers/dev.controller.js");

router.get("/genDummy", controller.insertDummyData);

module.exports = router;
