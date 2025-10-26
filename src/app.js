const express = require("express");
const connectDb = require("./config/database");
const app = express(); //app is instance of express js application, creating new web server
const User = require("./models/user");

app.use(express.json()); //middleware to parse json body

app.post("/signup", async (req, res) => {
  const userObject = req.body;

  const user = new User(userObject);
  try {
    await user.save();
    res.send("User Added Succesfully!"); // saving the user object to the database
  } catch (err) {
    console.log("Error in saving user", err.message);
    res.status(400).send(err.message);
  }
  //   const userObject = {
  //     firstName: "Pushpa",
  //     lastName: "Jaini",
  //     emailId: "pushpa@gmail.com",
  //     password: "Pushpa@123",
  //   };
  //   // creating a new instance of the User Model
  //   const user = new User(userObject);
  //   try {
  //     await user.save();
  //     res.send("User Added Succesfully!"); // saving the user object to the database
  //   } catch (err) {
  //     res.status(400).send("Error in saving user");
  //   }
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
app.patch("/update", async (req, res) => {
  const UserId = req.body.userId;
  const data = req.body;
  try {
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
