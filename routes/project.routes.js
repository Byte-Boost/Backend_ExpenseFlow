const controller = require('../controllers/project.controller.js');
const preferencesController = require('../controllers/mongodb/projectPreference.controller.js');
const adminMiddleware = require('../middleware/admin.middleware');
const router = require('express').Router();

router.post('/', adminMiddleware, controller.createProject);
router.post('/preferences', adminMiddleware, preferencesController.createPreference);

router.get('/', controller.getProjects);
router.get('/preferences', preferencesController.getAllPreferences);
router.get('/:id', controller.getProjectById);
router.get('/preferences/:projectId', preferencesController.getPreferencesById);

router.put('/preferences/:projectId', adminMiddleware, preferencesController.updatePreferenceById);

router.delete('/:id', adminMiddleware, controller.deleteProject);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management and preferences
 */

/**
 * @swagger
 * /project:
 *   post:
 *     tags: [Projects]
 *     summary: Create a new project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               preferences:
 *                 type: object
 *                 properties:
 *                   refundLimit:
 *                     type: number
 *                   expenseLimit:
 *                     type: number
 *                   quantityValues:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       201:
 *         description: Project created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projectId:
 *                   type: integer
 *                 warning:
 *                   type: string
 *       400:
 *         description: Invalid input or failed to create project
 */

/**
 * @swagger
 * /project:
 *   get:
 *     tags: [Projects]
 *     summary: Get all projects for the logged-in user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       400:
 *         description: Error fetching projects
 */

/**
 * @swagger
 * /project/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Get a project by ID
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
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 preferences:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     refundLimit:
 *                       type: number
 *                     expenseLimit:
 *                       type: number
 *                     quantityValues:
 *                       type: array
 *                       items:
 *                         type: string
 *       404:
 *         description: Project not found
 *       400:
 *         description: Error fetching project
 */

/**
 * @swagger
 * /project/preferences:
 *   get:
 *     tags: [Projects]
 *     summary: Get all project preferences
 *     responses:
 *       200:
 *         description: List of all project preferences
 *       400:
 *         description: Error fetching preferences
 */

/**
 * @swagger
 * /project/preferences/{projectId}:
 *   get:
 *     tags: [Projects]
 *     summary: Get preferences for a project by project ID
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Preferences retrieved
 *       404:
 *         description: Preferences not found
 *       400:
 *         description: Error retrieving preferences
 */

/**
 * @swagger
 * /project/preferences:
 *   post:
 *     tags: [Projects]
 *     summary: Create preferences for a project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectId, refundLimit, expenseLimit, quantityValues]
 *             properties:
 *               projectId:
 *                 type: integer
 *               refundLimit:
 *                 type: number
 *               expenseLimit:
 *                 type: number
 *               quantityValues:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Preferences created
 *       400:
 *         description: Error creating preferences
 */

/**
 * @swagger
 * /project/preferences/{projectId}:
 *   put:
 *     tags: [Projects]
 *     summary: Update preferences for a project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refundLimit:
 *                 type: number
 *               expenseLimit:
 *                 type: number
 *               quantityValues:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Preferences updated
 *       400:
 *         description: Error updating preferences
 *       404:
 *         description: Preferences not found
 */
