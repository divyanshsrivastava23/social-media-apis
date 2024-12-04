const express = require("express");
const router = express.Router();
const requiredLogin = require("../middlewares/requireLogin");

const {
  userProfile,
  followUser,
  unfollowUser,
  updateUser,
} = require("../controllers/user");

router.get("/user/:userId", requiredLogin, userProfile);
router.put("/follow", requiredLogin, followUser);
router.put("/unfollow", requiredLogin, unfollowUser);
router.put("/updateUser", requiredLogin, updateUser);

module.exports = router;
