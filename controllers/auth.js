const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");

const User = require("../models/user");
const { JWT_SECRET } = require("../keys");

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "no-reply--1221@outlook.com",
    pass: "QWERTY123!@#",
  },
});

const signUp = (req, res) => {
  const { name, email, password, username } = req.body;
  if (!name || !password || !email || !username) {
    return res.status(422).json({
      error: "please provide all the fields",
    });
  }

  if (
    name.length < 3 ||
    typeof name !== "string" ||
    typeof username !== "string"
  ) {
    return res.status(422).json({
      error:
        "Name should be more then 3 Characters and it should be of type string.",
    });
  }

  if (password.length < 3 || typeof password !== "string") {
    return res.status(422).json({
      error:
        "Password should be more then 3 characters and it should be of type string",
    });
  }

  User.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res.status(422).json({
        error: "User is already registered",
      });
    }

    bcrypt.hash(password, 10).then((hashedPassword) => {
      const user = new User({
        name,
        email,
        password: hashedPassword,
        username,
      });
      user
        .save()
        .then((user) => {
          const options = {
            from: "no-reply--1221@outlook.com",
            to: user.email,
            subject: "Signed up Successfully.",
            html: `<p> Hello <b>${name}</b> you have successfully signed up for the Picstgram. </p> <h4> <a href="www.picstagram.com">Click here</a> To Login <h4>`,
          };
          transporter.sendMail(options, (err, info) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log(`Sent: ${info.response}`);
          });
          res.json({
            message: "User has registered successfully.",
          });
        })
        .catch((err) => {
          return res.status(422).json({
            error: "Username is invalid.",
          });
          // console.log(err.message);
        });
    });
  });
};

const signIn = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({
      error: "All fields are mandatory.",
    });
  }

  if (password.length < 3 || typeof password !== "string") {
    return res.status(422).json({
      error:
        "Password should be atleast 3 characters long and should be of type string.",
    });
  }

  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({
        error: "entered wrong email or password",
      });
    }

    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, username, avatar } =
            savedUser;
          res.json({
            token,
            user: { _id, email, name, followers, following, username, avatar },
          });
        } else {
          return res.status(422).json({
            error: "entered wrong email or password",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const resetPassword = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) console.log(err);
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) return res.status(422).json({ error: "User doesn't exist" });
      user.resetToken = token;
      user.expireToken = Date.now() + 900000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "no-reply--1221@outlook.com",
          subjet: "Password reset",
          html: `
          <p>A request has been recieved to change the password for your Insta account. </p>
          <h3> <a href="http://localhost:3002/resetpassword/${token}"> Click here </a> to change the password. </h3>
          `,
        });
        res.json({ message: "Check your email!" });
      });
    });
  });
};

const newPassword = (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user)
        return res.status(422).json({ error: "Try again session expired" });
      bcrypt.hash(newPassword, 12).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: "Password updated successfully" });
        });
      });
    })
    .catch((err) => console.log(err));
};
module.exports = { signUp, signIn, resetPassword, newPassword };
