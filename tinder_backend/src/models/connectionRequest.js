const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User",
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  },
);




connectionRequestSchema.index({fromUserId:1, toUserId :1})

connectionRequestSchema.pre("save", function () {

  const connectionRequest = this;
  //checck if the fromuserid and touserid are the same
  if (connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
    throw new Error("You cannot send a connection request to yourself");
  }
});


const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);
module.exports = ConnectionRequestModel;
