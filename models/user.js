const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/devyanshsrivastava/image/upload/v1646128609/empty_z5yygy.jpg",
  },
  resetToken: String,
  expireToken: Date,
  username: {
    type: String,
    required: true,
    unique: true,
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
