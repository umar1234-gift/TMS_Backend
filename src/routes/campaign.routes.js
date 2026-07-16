const express = require("express");
const campaignController = require("../controllers/campaign.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");
const { validate } = require("../middlewares/validator");
const {
	createValidator,
	updateValidator,
} = require("../validators/campaign.validator");

const router = express.Router();

// All routes below require authentication
router.use(authMiddleware);

router.get("/", campaignController.getAll);
router.get("/:id", campaignController.getOne);
router.post(
	"/",
	upload.single("image"),
	createValidator,
	validate,
	campaignController.create,
);
router.put(
	"/:id",
	upload.single("image"),
	updateValidator,
	validate,
	campaignController.update,
);
router.delete("/:id", campaignController.remove);

module.exports = router;