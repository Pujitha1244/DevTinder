const express = require("express");

const app = express(); //app is instance of express js application, creating new web server

const {adminAuth, userAuth} = require("./middlewares/auth");

app.use('/admin', adminAuth);

app.get('/user', userAuth, (req, res) => {
  // Logic for fetching user data from database
  res.send("This is user API");
});

app.get("/admin/getAllData", (req, res) => {
  // Logis for Fetching all data from database
  res.send("This is admin get all data API");
});

app.get("/admin/deleteUser", (req, res) => {
  // Logic for deleting a user from database
  res.send("This is admin delete user API");
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

