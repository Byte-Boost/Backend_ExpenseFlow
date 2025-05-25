const controller = require("../controllers/refund.controller.js");
const router = require("express").Router();
const adminMiddleware = require("../middleware/admin.middleware");

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
    if (!file || !refundId || !type || !value) {
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
router.patch("/:id/authorize", adminMiddleware, controller.authRefund);

router.get("/", controller.getRefunds);
router.get("/expense/:id", controller.getExpenseById);
router.get("/summary", controller.getSummary);
router.get("/:id", controller.getRefundById);

router.delete("/:id", controller.deleteRefund);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Refunds
 *   description: Refund and expense management
 */

/**
 * @swagger
 * /refund/{projectId}:
 *   post:
 *     tags: [Refunds]
 *     summary: Create a new refund request
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID to associate the refund with
 *     responses:
 *       201:
 *         description: Refund created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 refundId:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Project not found or error creating refund
 */

/**
 * @swagger
 * /refund/expense:
 *   post:
 *     tags: [Refunds]
 *     summary: Create an expense for a refund
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [file, refundId, type, value]
 *             properties:
 *               file:
 *                 type: string
 *                 format: base64
 *               refundId:
 *                 type: integer
 *               type:
 *                 type: string
 *               quantityType:
 *                 type: string
 *                 nullable: true
 *               value:
 *                 type: number
 *               description:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Invalid refund ID or missing fields
 *       500:
 *         description: Error saving file or creating expense
 */

/**
 * @swagger
 * /refund/{id}/close:
 *   patch:
 *     tags: [Refunds]
 *     summary: Close a refund request
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Refund closed successfully
 *       400:
 *         description: Refund not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /refund/{id}/authorize:
 *   patch:
 *     tags: [Refunds]
 *     summary: Approve or reject a refund
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: approved
 *         required: true
 *         schema:
 *           type: boolean
 *         description: true = approve, false = reject
 *     requestBody:
 *       description: Provide rejectionReason when rejecting a refund
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rejectionReason:
 *                 type: string
 *                 description: Required if approved=false
 *     responses:
 *       200:
 *         description: Refund status updated successfully
 *       400:
 *         description: Invalid request or missing rejection reason
 */

/**
 * @swagger
 * /refund:
 *   get:
 *     tags: [Refunds]
 *     summary: Get refunds by filters with pagination and total values
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Comma-separated list of statuses (e.g., approved,in-process)
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: periodStart
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: periodEnd
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: timezone
 *         schema:
 *           type: integer
 *           example: -3
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: List of refunds with pagination and total values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 refunds:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       totalValue:
 *                         type: number
 *                         format: float
 *                       Expenses:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             date:
 *                               type: string
 *                               format: date-time
 *                             type:
 *                               type: string
 *                             value:
 *                               type: number
 *                               format: float
 *                       User:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           email:
 *                             type: string
 *                 maxPages:
 *                   type: integer
 *                 totalCount:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       400:
 *         description: Error fetching refunds
 */

/**
 * @swagger
 * /refund/{id}:
 *   get:
 *     tags: [Refunds]
 *     summary: Get refund by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Refund data
 *       400:
 *         description: Error fetching refund
 */

/**
 * @swagger
 * /refund/expense/{id}:
 *   get:
 *     tags: [Refunds]
 *     summary: Get expense by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense data
 *       400:
 *         description: Error fetching expense
 */

/**
 * @swagger
 * /refund/summary:
 *   get:
 *     tags: [Refunds]
 *     summary: Get refund summary by status
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by project ID
 *       - in: query
 *         name: periodStart
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date filter (ISO date)
 *       - in: query
 *         name: periodEnd
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date filter (ISO date)
 *       - in: query
 *         name: timezone
 *         schema:
 *           type: integer
 *           default: -3
 *         required: false
 *         description: Timezone offset (hours)
 *     responses:
 *       200:
 *         description: Summary of refunds grouped by status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalQuantity:
 *                   type: integer
 *                 totalValue:
 *                   type: number
 *                 approved:
 *                   type: object
 *                   properties:
 *                     quantity:
 *                       type: integer
 *                     totalValue:
 *                       type: number
 *                 rejected:
 *                   type: object
 *                   properties:
 *                     quantity:
 *                       type: integer
 *                     totalValue:
 *                       type: number
 *                 in-process:
 *                   type: object
 *                   properties:
 *                     quantity:
 *                       type: integer
 *                     totalValue:
 *                       type: number
 *       400:
 *         description: Error fetching summary
 */

/**
 * @swagger
 * /refund/{id}:
 *   delete:
 *     tags: [Refunds]
 *     summary: Delete a refund
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Refund deleted successfully
 *       403:
 *         description: Cannot delete a refund that is not new
 *       404:
 *         description: Refund not found
 *       500:
 *         description: Server error
 */

