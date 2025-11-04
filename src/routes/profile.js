const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send("user profile of " + user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request!");
      // return res.status(400).send("Invalid Edit Request!")
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    // res.send(
    //   loggedInUser +
    //     `${loggedInUser.firstName}, your profile has updated successfuly`
    // );
    res.json({
      message: `${loggedInUser.firstName}, your profile has updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;
