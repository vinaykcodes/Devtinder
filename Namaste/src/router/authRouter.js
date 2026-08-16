const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/user.js");
const jwt = require("jsonwebtoken");
const { signinValidation } = require("../middleWare/signinValidation.js");

authRouter.post("/signin", async (req, res) => {
  try {
    signinValidation(req);
    const { emailID, firstName, lastName, password } = req.body;
    const passwordhash = await bcrypt.hash(password, 10);
    console.log(passwordhash);
    const user = new User({
      firstName,
      lastName,
      password: passwordhash,
      emailID,
    });
    await user.save();
    const auser = await User.findOne({ emailID });
    const token = await jwt.sign({ _id: auser._id }, "DevTinder@namaste$Dev");
    console.log(token);
    res.cookie("token", token);
    res.send(user);
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { password, emailID } = req.body;
  try {
    const user = await User.findOne({ emailID });
    if (!user) throw new Error("invalid credential..😭");
    const isPassValid = await user.isValidPass(password);
    if (!isPassValid) throw new Error("invalid credential..");
    else {
      const token = await user.getJwt();
      console.log(token);
      res.cookie("token", token, { maxAge: 60 * 60 * 24 * 7 * 1000 });
      res.send(user);
    }
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("user has logout successfully💕🚀");
});
module.exports = authRouter;
