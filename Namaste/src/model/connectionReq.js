const mongoose = require("mongoose");
const User = require("./user");

const connectionReqSchema = mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: {
      values: ["interested", "rejected", "ignored", "accepted", "blocked"],
      message: `{VALUE} is incorrect types`,
      required: true,
    },
  },
});
connectionReqSchema.index(
  { fromUserId: 1, toUserId: 1 },
  { unique: true, name: "unique_connection_request_pair" },
);
connectionReqSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cant make connection request to yourself...🔴");
  }
});
const ConnectionReq = mongoose.model("ConnectionReqMODEL", connectionReqSchema);
module.exports = ConnectionReq;
