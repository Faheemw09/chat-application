const express = require("express");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../Model/userModel");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      const user = new User({
        name,
        email,
        password: hash,
        role,
      });
      await user.save();

      res.status(200).json({
        message: "Register user sucessfully",
        data: user,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
});
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { authorID: user._id, role: user.role },
            "masai"
          );
          res.status(200).send({ msg: "login sucessfull", token: token });
        } else {
          res.status(400).send({ msg: "wrong credentials" });
        }
      });
    } else {
      res.status(400).send({ msg: "wrong credentials" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Iinternal server Error",
    });
  }
});
module.exports = {
  userRouter,
};
