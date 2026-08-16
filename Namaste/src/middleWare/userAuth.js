const User = require("../model/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).send("ERR: token is not valid");

    const decodeObj = await jwt.verify(token, "DevTinder@namaste$Dev");
    const { _id } = decodeObj;
    const user = await User.findById(_id);

    if (!user) return res.status(401).send("ERR: user is not valid");

    req.user = user;

    if (typeof next === "function") {
      return next();
    }

    return res.status(200).json({ message: "Authorized" });
  } catch (err) {
    res.status(500).send("ERR: " + err.message)
  }
};
module.exports = userAuth;
