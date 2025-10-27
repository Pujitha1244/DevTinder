const mongoose = require("mongoose");

// connected to cluster

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://pujithavankadari1244_db_user:SagarJaini123@namastenode.rxxns9u.mongodb.net/devTinder"
  );
};

module.exports = connectDb;
