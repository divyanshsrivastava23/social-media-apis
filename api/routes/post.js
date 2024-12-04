const express = require("express");
const router = express.Router();
const requiredLogin = require("../middlewares/requireLogin");

const {
  createPost,
  fetchPost,
  userPost,
  fetchFollowingPost,
  likePost,
  unlikePost,
  postComment,
  deletePost,
  deleteComment,
} = require("../controllers/post");

router.post("/createpost", requiredLogin, createPost);
router.get("/allpost", requiredLogin, fetchPost);
router.get("/followingposts", requiredLogin, fetchFollowingPost);
router.get("/mypost", requiredLogin, userPost);
router.put("/like", requiredLogin, likePost);
router.put("/unlike", requiredLogin, unlikePost);
router.put("/comments", requiredLogin, postComment);
router.delete("/deletepost/:postId", requiredLogin, deletePost);
router.delete(
  "/deletecomment/:postId/:commentId",
  requiredLogin,
  deleteComment
);
module.exports = router;
