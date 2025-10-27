const express = require("express");
const connectDb = require("./config/database");
const app = express(); //app is instance of express js application, creating new web server
const User = require("./models/user");
const { validateSignUpData, validateLoinData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json()); //middleware to parse json body

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    validateLoinData(req);

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credientials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("User login Successful");
    } else {
      throw new Error("Invalid Credientials");
    }
  } catch (err) {
    console.log("ERROR : " + err.message);
    res.status(400).send(err.message);
  }
});

// find user by email
app.get("/user", async (req, res) => {
  console.log("User email", req.body);
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User Not Found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went Worng");
  }
});

// Feed API - GET / feed get all the users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went Worng");
  }
});

// Update Data os the User
app.patch("/user/:userId", async (req, res) => {
  const UserId = req.params?.userId;
  const data = req.body;
  console.log("Update Data", data, UserId);
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Invalid Updates!");
    }
    // if (data?.skills.length > 10) {
    //   throw new Error("Skills should not exceed 10");
    // }
    if (data.skills && data.skills.length > 10) {
      return res.status(400).send("Skills should not exceed 10");
    }

    await User.findByIdAndUpdate({ _id: UserId }, data, {
      runValidators: true,
    });
    res.send("User Updated Successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send("User Not Found");
    } else {
      res.send("User Deleted Successfully");
    }
  } catch (err) {
    res.status(400).send("Something went Worng");
  }
});

connectDb()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3001, () => {
      console.log("Server is running on port 3001");
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
