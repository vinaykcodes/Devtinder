const express = require("express");
const app = express();
const { connectDB } = require("./config/dataBase.js");
const User = require("./model/user.js");
const feedRouter = require("./router/feedRouter.js");
// Query from mongoose is not used directly
// js-cookie is browser-only — use cookie-parser + res.cookie() on the server

const cookieParser = require("cookie-parser");

const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:5175",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json()); // middleware for converting json(which we cant read) ->js object)

const authRouter = require("./router/authRouter.js");
const profileRouter = require("./router/profileRouter.js");
const requestRouter = require("./router/requestRouter.js");
const userRouter = require("./router/userRouter.js");
const { trusted } = require("mongoose");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", feedRouter);

// app.get("/user", async (rq, rs) => {
//   const { emailID } = rq.body;
//   try {
//     const user = await User.find({ emailID: emailID });
//     console.log(user);
//     if (user.length != 0) {
//       rs.send(user);
//     } else {
//       throw new Error("error hai ji");
//     }
//   } catch (err) {
//     rs.status(400).send("erro...r" + "  " + err.message);
//   }
// });

// app.delete("/user/:id", async (rq, rs) => {
//   const _id = rq.params.id;
//   try {
//     await User.findByIdAndDelete(_id);
//     rs.send("user deleted successfully..✅");
//   } catch (err) {
//     rs.status(401).send("something went wrong..");
//   }
// });
// app.patch("/user/:id", async (req, res) => {
//   const data = req.body;
//   const id = req.params.id;

//   try {
//     const validFeilds = ["about", "age", "photourl", "firstName", "lastName"];
//     const isvalidFeilds = Object.keys(data).every((val) =>
//       validFeilds.includes(val),
//     );
//     if (!isvalidFeilds) {
//       throw new Error("invalid feild updation is not allowed");
//     }
//     const user = await User.findByIdAndUpdate({ _id: id }, req.body);
//     console.log(user);
//     res.send("changes has made successfully💕🚀");
//   } catch (err) {
//     res.status(401).send("something went wrong.." + err.message);
//   }
// });
app.patch("/test", (req, res) => {
  res.send("CORS working");
});

connectDB()
  .then(() => {
    console.log("dataBase connection has estabilished..");
    const server = app.listen(3000, () => {
      console.log("server has started on port 3000 🚀");
    });
  })
  .catch((err) => {
    console.log("dataBase couldn't connected..");
  });
