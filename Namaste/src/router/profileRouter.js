const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middleWare/userAuth.js");
const User = require("../model/user.js");
const isvalidFeilds = require("../utils/isvalidFeilds.js");
const validator = require("validator");
const bcrypt = require("bcrypt");
const cors = require("cors");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(404).send("err: ", err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!isvalidFeilds(req)) {
      throw new Error("Invalid feild edit");
    }
    console.log(user);

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    await user.save();
    console.log(user);
    res.json({
      message: `${user.firstName} changes has made`,
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { password } = req.body;
    if (!validator.isStrongPassword(password))
      throw new Error("password is not strong enough");
    const passwordhash = await bcrypt.hash(password, 10);
    const updateduser = await User.findByIdAndUpdate(
      { _id: user._id },
      { password: passwordhash },
    );
    console.log(updateduser);
    res.send("password has changed successfully💕🚀");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
