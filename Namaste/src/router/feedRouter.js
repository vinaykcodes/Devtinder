const express = require("express");
const userAuth = require("../middleWare/userAuth");
const ConnectionReq = require("../model/connectionReq");
const User = require("../model/user");
const feedRouter = express.Router();

feedRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // users to exclude from the feed:
    // 1. the logged-in user
    // 2. users who already have a connection request with the logged-in user

    const relatedConnections = await ConnectionReq.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).select("fromUserId toUserId");
    const toBeIgnored = new Set();
    relatedConnections.map((dt) => {
      toBeIgnored.add(dt.fromUserId.toString());
      toBeIgnored.add(dt.toUserId.toString());
    });
    const actualFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(toBeIgnored) } },
        {
          _id: { $ne: loggedInUserId },
        },
      ],
    })
      .select("firstName lastName photourl about age ")
      .skip(skip)
      .limit(limit);

    res.json({
      message: "feed fetched..🚀",
      data: actualFeed,
    });
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});

module.exports = feedRouter;
