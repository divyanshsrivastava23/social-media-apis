const Post = require("../models/post");

const createPost = (req, res) => {
  const { title, body, photo } = req.body;
  if (!title || !body || !photo) {
    return res.status(422).json({
      error: "Please add all the fields.",
    });
  }

  req.user.password = undefined;

  const post = new Post({
    title,
    body,
    photo,
    postedBy: req.user, //? the req.user has the data of the user
  });

  post
    .save()
    .then((result) => {
      res.json({
        post: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const fetchPost = (req, res) => {
  Post.find()
    .populate("postedBy", "_id name avatar") //? populate basically extracting user details from postedBy
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
};

const fetchFollowingPost = (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
};

const userPost = (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((userCreatedPost) => {
      res.json({ userCreatedPost });
    })
    .catch((err) => console.log(err));
};

const likePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true, //! returns the new updated record from mongoDB.
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      err ? res.status(422).json({ error: err }) : res.json(result);
    });
};

const unlikePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      err ? res.status(422).json({ error: err }) : res.json(result);
    });
};

const postComment = (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      err ? res.status(422).json({ error: err }) : res.json(result);
    });
};

const deletePost = (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id name")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => res.json(result))
          .catch((err) => console.log(err));
      }
    });
};

const deleteComment = (req, res) => {
  const comment = { _id: req.params.commentId };
  Post.findByIdAndUpdate(
    req.params.postId,
    {
      $pull: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, comment) => {
      if (err || !comment) {
        return res.status(422).json({ error: err });
      } else {
        res.json(comment);
      }
    });
};

module.exports = {
  createPost,
  fetchPost,
  userPost,
  fetchFollowingPost,
  likePost,
  unlikePost,
  postComment,
  deletePost,
  deleteComment,
};
