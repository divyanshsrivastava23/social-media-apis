const User = require("../models/user");
const Post = require("../models/post");

const userProfile = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.userId })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) return res.status(422).json({ error: err });
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
};

const followUser = (req, res) => {
  // * FollowId is of the user which we are following.
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) return res.status(422).json({ error: err });
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => res.json(result))
        .catch((err) => res.status(422).json({ error: err }));
    }
  );
};

const unfollowUser = (req, res) => {
  // *UnfollowId is of the user which we are unfollowing.
  User.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { followers: req.user._id } },
    { new: true },
    (err, result) => {
      if (err) return res.status(422).json({ error: err });
      User.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: req.body.unfollowId } },
        { new: true }
      )
        .select("-password")
        .then((result) => res.json(result))
        .catch((err) => res.status(422).json({ error: err }));
    }
  );
};

const updateUser = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(422).json({
      error: "Please add a picture to update.",
    });
  }
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { avatar: avatar },
    },
    { new: true },
    (err, result) => {
      if (err) return res.status(422).json({ error: err });
    }
  )
    .select("-password")
    .then((result) => res.json(result))
    .catch((err) => res.status(422).json({ error: err }));
};

module.exports = { userProfile, followUser, unfollowUser, updateUser };
