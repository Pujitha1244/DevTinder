const express = require("express");
const { validateSignUpData, validateLoinData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  // Validation of Data
  try {
    validateSignUpData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // save the User
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    if (user.skills && user.skills.length > 10) {
      throw new Error("Skills should not exceed 10");
    }
    await user.save();
    res.send("User Added Succesfully!"); // saving the user object to the database
  } catch (err) {
    console.log("ERROR : " + err.message);
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    validateLoinData(req);
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credientials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      // Add the JWT token to cookie and send the response back to the User
      res.cookie("token", token);

      res.send("User login Successful");
    } else {
      throw new Error("Invalid Credientials");
    }
  } catch (err) {
    console.log("ERROR : " + err.message);
    res.status(400).send(err.message);
  }
});

module.exports = authRouter;
