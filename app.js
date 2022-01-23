const express = require("express");
const app = express();
const mongoose = require("mongoose");

// *Routes
const authRoute = require("./routes/auth.js"); //? authentication route
const postRoute = require("./routes/post.js");
const userRoute = require("./routes/user.js");

const { MONGOURI } = require("./keys"); //? Mongo URL
const PORT = 5000;

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

// * starting the app
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
