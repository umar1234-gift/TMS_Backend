const express = require("express");
const faqController = require("../controllers/faq.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validator");
const {
	createValidator,
	updateValidator,
} = require("../validators/faq.validator");

const router = express.Router();
router.use(authMiddleware);

router.get("/", faqController.getAll);
router.post("/", createValidator, validate, faqController.create);
router.put("/:id", updateValidator, validate, faqController.update);
router.delete("/:id", faqController.remove);

module.exports = router;