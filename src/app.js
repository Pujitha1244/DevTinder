const express = require("express");
const connectDb = require("./config/database");
const app = express(); //app is instance of express js application, creating new web server
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// app.use(express.json()); //middleware to parse json body
// app.use(express.json({
//   verify: (req, res, buf) => {
//     // keep raw JSON body to validate Razorpay signature later
//     req.rawBody = buf.toString();
//   }
// }));
app.use(express.json({
  verify: (req, res, buf, encoding) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  }
}));
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

connectDb()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port 3001");
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// const express = require("express");
// const connectDb = require("./config/database");
// const app = express(); //app is instance of express js application, creating new web server
// const User = require("./models/user");
// const { validateSignUpData, validateLoinData } = require("./utils/validation");
// const bcrypt = require("bcrypt");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const { userAuth } = require("./middlewares/auth");

// app.use(express.json()); //middleware to parse json body
// app.use(cookieParser());

// app.post("/signup", async (req, res) => {
//   // Validation of Data
//   try {
//     validateSignUpData(req);

//     // Encrypt the password
//     const { firstName, lastName, emailId, password } = req.body;
//     const passwordHash = await bcrypt.hash(password, 10);

//     // save the User
//     const user = new User({
//       firstName,
//       lastName,
//       emailId,
//       password: passwordHash,
//     });

//     if (user.skills && user.skills.length > 10) {
//       throw new Error("Skills should not exceed 10");
//     }
//     await user.save();
//     res.send("User Added Succesfully!"); // saving the user object to the database
//   } catch (err) {
//     console.log("ERROR : " + err.message);
//     res.status(400).send(err.message);
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     const { emailId, password } = req.body;
//     validateLoinData(req);
//     const user = await User.findOne({ emailId: emailId });
//     if (!user) {
//       throw new Error("Invalid Credientials");
//     }
//     // const isPasswordValid = await bcrypt.compare(password, user.password);
//     const isPasswordValid = await user.validatePassword(password);

//     if (isPasswordValid) {
//       // Create a JWT Token
//       // hiding User ID and secret key we are giving below, only server will know this secret key

//       // adding this in User Schema
//       // const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$011094", {
//       //   expiresIn: "7d",
//       // });
//       const token = await user.getJWT();

//       // Add the JWT token to cookie and send the response back to the User
//       res.cookie("token", token);

//       res.send("User login Successful");
//     } else {
//       throw new Error("Invalid Credientials");
//     }
//   } catch (err) {
//     console.log("ERROR : " + err.message);
//     res.status(400).send(err.message);
//   }
// });

// app.get("/profile", userAuth, async (req, res) => {
//   try {
//     const user = req.user;
//     res.send("user profile of " + user.firstName);

//     res.send("reading");
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

// app.post("/sendConnectionRequest", userAuth, async (req, res) => {
//   const user = req.user;
//   // sending connection Request
//   console.log("sending connection request");
//   res.send(user.firstName + ":connection request sent");
// });

// // find user by email
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const users = await User.find({ emailId: userEmail });
//     if (users.length === 0) {
//       res.status(404).send("User Not Found");
//     } else {
//       res.send(users);
//     }
//   } catch (err) {
//     res.status(400).send("Something went Worng");
//   }
// });

// // Feed API - GET / feed get all the users
// app.get("/feed", userAuth, async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went Worng");
//   }
// });

// // Update Data os the User
// app.patch("/user/:userId", async (req, res) => {
//   const UserId = req.params?.userId;
//   const data = req.body;
//   try {
//     const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Invalid Updates!");
//     }
//     // if (data?.skills.length > 10) {
//     //   throw new Error("Skills should not exceed 10");
//     // }
//     if (data.skills && data.skills.length > 10) {
//       return res.status(400).send("Skills should not exceed 10");
//     }

//     await User.findByIdAndUpdate({ _id: UserId }, data, {
//       runValidators: true,
//     });
//     res.send("User Updated Successfully");
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

// app.delete("/delete", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     const user = await User.findByIdAndDelete(userId);
//     if (!user) {
//       res.status(404).send("User Not Found");
//     } else {
//       res.send("User Deleted Successfully");
//     }
//   } catch (err) {
//     res.status(400).send("Something went Worng");
//   }
// });

// connectDb()
//   .then(() => {
//     console.log("Connected to MongoDB");
//     app.listen(3001, () => {
//       console.log("Server is running on port 3001");
//     });
//   })
//   .catch((err) => {
//     console.log("Error connecting to MongoDB", err);
//   });

// // app.get("/profile", userAuth, async (req, res) => {
// //   try {
// //     const cookies = req.cookies;
// //     const { token } = cookies;
// //     if (!token) {
// //       throw new Error("Invali Token please login again");
// //     }
// //     // Validate My Token
// //     const decodedMessage = await jwt.verify(token, "DEV@Tinder$011094");
// //     const { _id } = decodedMessage;

// //     const user = await User.findById({ _id: _id });
// //     if (!user) {
// //       throw new Error("User Not Found");
// //     }
// //     res.send("user profile of " + user.firstName);

// //     res.send("reading");
// //   } catch (err) {
// //     res.status(400).send(err.message);
// //   }
// // });
