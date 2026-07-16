const express = require("express");
const contactController = require("../controllers/contact.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();
router.use(authMiddleware);

router.get("/", contactController.getAll);
router.get("/:id", contactController.getOne);
router.patch("/:id/read", contactController.toggleRead);

module.exports = router;