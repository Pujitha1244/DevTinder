const express = require("express");
const connectDb = require("./config/database");
const app = express(); //app is instance of express js application, creating new web server
const User = require("./models/user");

app.use(express.json()); //middleware to parse json body

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const userObject = req.body;

  const user = new User(userObject);
  try {
    await user.save();
    res.send("User Added Succesfully!"); // saving the user object to the database
  } catch (err) {
    res.status(400).send("Error in saving user");
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
