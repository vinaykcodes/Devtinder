const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middleWare/userAuth.js");
const User = require("../model/user.js");

const ConnectionReq = require("../model/connectionReq.js");
requestRouter.post(
  "/sendConnectionRequest/:status/:userID",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userID;
      const status = req.params.status;

      const isValidUser = await User.findById(toUserId);
      if (!isValidUser) {
        throw new Error("user is not Valid..✅");
      }

      const validStatus = ["ignored", "interested"];
      const isValid = validStatus.includes(status);
      if (!isValid) throw new Error("Invalid status is found");

      const data = new ConnectionReq({
        fromUserId,
        toUserId,
        status,
      });
      const existingReq = await ConnectionReq.findOne({
        $or: [
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
          {
            fromUserId: fromUserId,
            toUserId: toUserId,
          },
        ],
      });
      if (existingReq) {
        throw new Error("Connection Request has already been made🙈");
      }
      const user = await data.save();
      const receiver = await User.findById(toUserId);

      console.log("sending the connection request");
      res.json({
        message: `${req.user.firstName} sent connection request to ${receiver.firstName}`,
        data: user,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res
          .status(409)
          .send("Error : Connection Request already exists");
      }
      return res.status(404).send("Error :" + err.message);
    }
  },
);
requestRouter.post("/req/review/:status/:reqId", userAuth, async (req, res) => {
  try {
    const { status, reqId } = req.params;
    const validStatus = ["accepted", "rejected"];
    if (!validStatus.includes(status)) throw new Error("Invalid status found");
    const loggedInUser = req.user._id;

    const isValidUser = await ConnectionReq.findOne({
      fromUserId: reqId,
      toUserId: loggedInUser,
      status: "interested",
    });
    if (!isValidUser) throw new Error("no connection request found..");
    isValidUser.status = status;
    const data = await isValidUser.save();
    res.json({
      message: ` request has ${status} `,
      data: data,
    });
  } catch (err) {
    res.status(404).send("Error :" + err.message);
  }
});

requestRouter.post("/req/remove/:id", userAuth, async (req, res) => {
  try {
    const reqId = req.params.id;
    const loggedIn = req.user._id;

    const connection = await ConnectionReq.findOneAndDelete({
      status: "accepted",
      $or: [
        {
          fromUserId: reqId,
          toUserId: loggedIn,
        },
        {
          fromUserId: loggedIn,
          toUserId: reqId,
        },
      ],
    });
    res.send("removed successfully");
  } catch (err) {
    res.status(500).json({
      message: "Error: " + err.message,
    });
  }
});

requestRouter.post("/req/block/:id", userAuth, async (req, res) => {
  try {
    const reqId = req.params.id;
    const loggedIn = req.user._id;

    const connection = await ConnectionReq.findOne({
      status: "accepted",
      $or: [
        {
          fromUserId: reqId,
          toUserId: loggedIn,
        },
        {
          fromUserId: loggedIn,
          toUserId: reqId,
        },
      ],
    });

    if (!connection) {
      return res.status(404).json({
        message: "Connection not found",
      });
    }
    connection.status = "blocked";
    await connection.save();

    res.json({
      message: "Connection found",
      data: connection,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error: " + err.message,
    });
  }
});

module.exports = requestRouter;
