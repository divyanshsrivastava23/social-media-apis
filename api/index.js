const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

// *Routes
const authRoute = require("./routes/auth.js"); //? authentication route
const postRoute = require("./routes/post.js");
const userRoute = require("./routes/user.js");

const { MONGOURI } = require("./config/keys.js"); //? Mongo URL
const PORT = process.env.PORT || 5000;

// * connecting with mongoDB
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.connection.on("connected", () => {
  console.log("Database Connected!");
});
mongoose.connection.on("error", (err) => {
  console.log("Error in connecting: ", err);
});

app.use(express.json()); // ? this is basically parses the request with json payload
app.use(authRoute);
app.use(postRoute);
app.use(userRoute);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "client", "build", "index.html")
    );
  });
}

// * starting the app
app.listen(PORT, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
