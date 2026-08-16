const express = require("express");
const userAuth = require("../middleWare/userAuth");

const ConnectionReq = require("../model/connectionReq");
const authRouter = require("./authRouter");
const userRouter = express.Router();
userRouter.get("/user/req/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const requests = await ConnectionReq.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photourl about age");
    const requ = requests.map((val) => val.fromUserId);
    console.log(requ);
    res.json({
      message: "data fetched",
      data: requ,
    });
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const connections = await ConnectionReq.find({
      status: "accepted",
      $or: [{ toUserId: loggedInUser }, { fromUserId: loggedInUser }],
    })
      .populate("fromUserId", " _id firstName lastName age about photourl ")
      .populate("toUserId", " _id firstName lastName age about photourl  ");
    console.log(connections);

    const data = connections.map((dt) =>
      !dt.fromUserId._id.equals(req.user._id)
        ? { _id: dt.fromUserId._id,
            firstName: dt.fromUserId.firstName,
            lastName: dt.fromUserId.lastName,
            age: dt.fromUserId.age,
            about: dt.fromUserId.about,
            photourl: dt.fromUserId.photourl,
          }
        : { _id: dt.toUserId._id,
            firstName: dt.toUserId.firstName,
            lastName: dt.toUserId.lastName,
            age: dt.toUserId.age,
            about: dt.toUserId.about,
            photourl: dt.toUserId.photourl,
          },
    );
    console.log(data);

    res.json({
      message: "data fetched",
      connectionList: data,
    });
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});
module.exports = userRouter;
