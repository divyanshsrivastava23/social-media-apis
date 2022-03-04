if (process.env.NODE_ENV === "production") {
  modile.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
