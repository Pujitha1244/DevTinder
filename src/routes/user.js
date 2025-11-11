const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender photoUrl skills about";
//Get all the pending connection Requests for the Logged In User
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "photoUrl",
      "skills",
      "about",
    ]);
    // .populate("fromUserId", ["firstName", "lastName"]);
    res.json({
      message: "data fetched Successfully",
      data: connectionRequests,
    });
  } catch (err) {
    req.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "photoUrl",
      "skills",
      "about",
    ]);

    const data = connectionRequests.map((row) => row.fromUserId); // Used to fetch only the details of connected person
    res.json({
      message: "Connections Fetched Succesfull",
      data: connectionRequests, // data
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Feed API
// userRouter.get("/feed", userAuth, async (req, res) => {
//   try {
//     const loggedInUser = req.user;

//     // find all the connections requests( sent + requested)
//     const connectionRequests = await ConnectionRequestModel.find({
//       $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
//     }).select("fromUserId toUserId");

//     const hideUsersFromFeed = new Set();

//     connectionRequests.forEach((req) => {
//       hideUsersFromFeed.add(req.fromUserId.toString());
//       hideUsersFromFeed.add(req.toUserId.toString());
//     });

//     const users = await User.find({
//       $and: [
//         { _id: { $nin: Array.from(hideUsersFromFeed) } }, // Id should not present in array from hideUsersFromFeed $nin: not in that array
//         { _id: { $ne: loggedInUser._id } }, //Id should not equal to loggedin userId $ne: not equal to
//       ],
//     }).select(USER_SAFE_DATA);

//     res.send(users);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

//feed?page=1&limit=10
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // find all the connections requests( sent + requested)
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } }, // Id should not present in array from hideUsersFromFeed $nin: not in that array
        { _id: { $ne: loggedInUser._id } }, //Id should not equal to loggedin userId $ne: not equal to
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
