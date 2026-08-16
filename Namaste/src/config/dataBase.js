const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vksahu160805_db_user:Vinay123@cluster0.euqawik.mongodb.net/DevTinder",
  );
};
module.exports = { connectDB };
