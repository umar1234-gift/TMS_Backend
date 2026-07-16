const express = require("express");
const settingController = require("../controllers/setting.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validator");
const { updateValidator } = require("../validators/setting.validator");

const router = express.Router();
router.use(authMiddleware);

router.get("/", settingController.getAll);
router.put("/", updateValidator, validate, settingController.update);

module.exports = router;