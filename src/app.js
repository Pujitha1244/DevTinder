const express = require("express");

const app = express(); //app is instance of express js application, creating new web server

app.use("/test",(req, res) => {
  res.send("test Server 1");
});

app.use("/hello",(req, res) => {
    res.send("Hello Server");
  });

app.use((req, res) => {
    res.send("Namaste");
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

