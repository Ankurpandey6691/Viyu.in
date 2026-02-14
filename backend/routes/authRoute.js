const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");

// Public registration is disabled
// Public registration is disabled
router.post("/login", login);

module.exports = router;
