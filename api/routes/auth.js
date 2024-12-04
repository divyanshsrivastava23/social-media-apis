const express = require("express");
const router = express.Router();

//* importing controllers:
const {
  signUp,
  signIn,
  resetPassword,
  newPassword,
} = require("../controllers/auth");

// * importing requiredLogin middleware:
const requireLogin = require("../middlewares/requireLogin");

// * authentication routes:
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/resetpassword", resetPassword);
router.post("/newpassword", newPassword);

module.exports = router;
