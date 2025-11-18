const mongoose = require("mongoose");

// connected to cluster

const connectDb = async () => {
  await mongoose.connect(
    process.env.DB_CONNECTION_SECRET
  );
};

module.exports = connectDb;
