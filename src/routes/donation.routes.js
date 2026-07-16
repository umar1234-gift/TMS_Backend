const express = require("express");
const donationController = require("../controllers/donation.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validator");
const { updateStatusValidator } = require("../validators/donation.validator");

const router = express.Router();
router.use(authMiddleware);

router.get("/", donationController.getAll);
router.get("/:id", donationController.getOne);
router.patch(
	"/:id/status",
	updateStatusValidator,
	validate,
	donationController.updateStatus,
);
router.get("/:id/receipt", donationController.getReceipt);

module.exports = router;