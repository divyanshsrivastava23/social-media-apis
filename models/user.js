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
      "https://res.cloudinary.com/devyanshsrivastava/image/upload/v1625416003/download_s397c2.png",
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
