const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailID: {
      lowercase: true,
      trim: true,
      type: String,
      required: true,
      unique: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("email is not valid..😴" + " " + val);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(val) {
        if (!["male", "female", "other"].includes(val))
          throw new Error("invalid gender");
      },
    },
    about: {
      type: [String],
      validate(val) {
        if (val.length >= 10) throw new Error("fuckup..🚀");
      },
    },
    photourl: {
      type: String,
      default: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    },
  },
  {
    timestamps: true,
  },
);
userSchema.index({ firstName: 1, lastName: 1 }); // if i make query from both of this feilds ,fetching become optimized
userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevTinder@namaste$Dev");
  return token;
};
userSchema.methods.isValidPass = async function (UserEnteredPass) {
  const user = this;
  const pass = user.password;
  const isvalid = await bcrypt.compare(UserEnteredPass, pass);
  return isvalid;
};
module.exports = mongoose.model("User", userSchema); // this is like creating class for document
