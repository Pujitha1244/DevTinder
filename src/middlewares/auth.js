const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // get the token from request cookies
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("Invalid Token, please login again");
    }

    // Validate the Token
    const decodedObj = await jwt.verify(token, "DEV@Tinder$011094");

    // find the user from the token
    const { _id } = decodedObj;
    const user = await User.findById({ _id: _id });

    // if user not found throw error
    if (!user) {
      throw new Error("User Not Found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
