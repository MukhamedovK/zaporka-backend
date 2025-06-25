const router = require("express").Router();
const {
  getCompanyInfo,
  updateCompanyInfo,
} = require("../controllers/companyInfoController");

router.get("/", getCompanyInfo)
router.put("/", updateCompanyInfo)

/**
 * @swagger
 * tags:
 *   name: CompanyInfo
 *   description: API for managing company information
 */

/**
 * @swagger
 * /api/v1/company-info:
 *   get:
 *     summary: Get or create default company information
 *     tags: [CompanyInfo]
 *     responses:
 *       200:
 *         description: Successfully retrieved company info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: array
 *                   items:
 *                     type: string
 *                 phoneNumbers:
 *                   type: array
 *                   items:
 *                     type: string
 *                 companyAddress:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                     latitude:
 *                       type: string
 *                     longitude:
 *                       type: string
 *                 telegram:
 *                   type: string
 *                 workTime:
 *                   type: string
 *                 companyInfo:
 *                   type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/company-info:
 *   put:
 *     summary: Update company information
 *     tags: [CompanyInfo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: array
 *                 items:
 *                   type: string
 *               phoneNumbers:
 *                 type: array
 *                 items:
 *                   type: string
 *               companyAddress:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   latitude:
 *                     type: string
 *                   longitude:
 *                     type: string
 *               telegram:
 *                 type: string
 *               workTime:
 *                 type: string
 *               companyInfo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated company info
 *       404:
 *         description: Company info not found
 *       500:
 *         description: Server error
 */


module.exports = router;
