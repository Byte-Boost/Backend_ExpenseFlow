const controller = require("../controllers/refund.controller.js");
const router = require("express").Router();

const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../userdata/receipt");
// This shouldn't be hard coded in but i don't want to mess with it right now.

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.post("/expense", (req, res) => {
  try {
    const { file, refundId, type, quantityType, value, description } = req.body;
    if (!file || !refundId || !type || !value || !description) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    const buffer = Buffer.from(file, "base64");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `file-${uniqueSuffix}.png`;
    const filePath = path.join(uploadDir, filename);
    console.log(filePath);
    fs.writeFileSync(filePath, buffer);

    const newReq = Object.assign({}, req, {
      body: {
        refundId: refundId,
        type: type,
        value: value,
        quantityType,
        description,
        file: filePath,
      },
    });

    controller.createExpense(newReq, res);
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).send({ message: "Error saving file" });
  }
});
router.post("/:projectId", controller.createRefund);

router.patch("/:id/close", controller.closeRefund);
router.patch("/:id/authorize", controller.authRefund);

router.get("/", controller.getRefunds);
router.get("/:id", controller.getRefundById);
router.get("/expense/:id", controller.getExpenseById);
router.delete("/:id", controller.deleteRefund);

module.exports = router;
