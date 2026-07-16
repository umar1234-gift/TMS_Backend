const express = require("express");
const programController = require("../controllers/program.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");
const { validate } = require("../middlewares/validator");
const {
	createValidator,
	updateValidator,
} = require("../validators/program.validator");

const router = express.Router();
router.use(authMiddleware);

router.get("/", programController.getAll);
router.get("/:id", programController.getOne);
router.post(
	"/",
	upload.single("image"),
	createValidator,
	validate,
	programController.create,
);
router.put(
	"/:id",
	upload.single("image"),
	updateValidator,
	validate,
	programController.update,
);
router.delete("/:id", programController.remove);

module.exports = router;