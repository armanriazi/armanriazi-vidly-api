const express = require("express");
const router = express.Router();
const auth = require("../services/auth");
const asyncMw = require("../middleware/async");
router.post(
  "/",
  async (req, res) => {
    auth.getUserByEmail(req.body, res);
  });

router.post(
  "/:refreshToken",
  async (req, res) => {
    auth.getTokenByRefreshToken(req, res);
  });

module.exports = router;
