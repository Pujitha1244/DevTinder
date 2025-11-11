const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User Collection 
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      // enum : we will use this when we want user to restrict to only some values
      enum: {
        values: ["ignored", "intrested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);
// setting index for faster manipulation , makes query faster, even there are millions of data in data base
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); // creating Index for fromUserId

// middle ware , this will be called when save, before save this will be called
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Check if Fromuserid is same as touserID
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to your self");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
