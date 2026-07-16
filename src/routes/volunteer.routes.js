const express = require("express");
const volunteerController = require("../controllers/volunteer.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validator");
const { updateStatusValidator } = require("../validators/volunteer.validator");

const router = express.Router();
router.use(authMiddleware);

router.get("/", volunteerController.getAll);
router.get("/:id", volunteerController.getOne);
router.patch(
	"/:id/status",
	updateStatusValidator,
	validate,
	volunteerController.updateStatus,
);

module.exports = router;