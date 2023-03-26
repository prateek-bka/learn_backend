const express = require("express");
const { UserModel } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userrouter = express.Router();

//Registration
userrouter.post("/register", async (req, res) => {
  const { email, password, location, age } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      const new_user = new UserModel({
        email: email,
        password: hash,
        location: location,
        age: age,
      });
      await new_user.save();

      res.status(200).send({ msg: "Registration has been done!" });
    });

    // bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    //   // Store hash in your password DB.
    // });

    // const new_user = new UserModel(req.body);
    // await new_user.save();
    // res.status(200).send({
    //   msg: "Registration has been done!",
    // });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

// Login
userrouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user_check = await UserModel.findOne({ email });
    // console.log(user_check);
    if (user_check) {
      bcrypt.compare(password, user_check.password, (err, result) => {
        if (result) {
          res.status(200).send({
            msg: "Login Successfull!",
            token: jwt.sign({ userID: user_check._id }, "masai"),
          });
        } else {
          res.status(400).send({ msg: "Wrong credentials!" });
        }
      });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }

  // const user_check = await UserModel.find({
  //   email: email,
  //   password: password,
  // });

  // if (user_check.length > 0) {
  //   console.log(user_check);
  //   res.status(200).send({ msg: `Login Successful ${email}` });
  // } else {
  //   res.status(400).send({ msg: `Login failed ${email}` });
  // }

  //Ternary Operator
  // user_check.length > 0
  //   ? res.status(200).send({
  //       msg: `Login Successful ${email}`,
  //       token: jwt.sign({ name: "batman" }, "bruce"),
  //     })
  //   : res.status(400).send({ msg: `Login failed ${email}` });
  // }
  // catch (error) {
  //   res.status(400).send({ msg: `Login failed` });
  // }
});

// userrouter.get("/details", (req, res) => {
//   const token = req.headers.authorization;
//   jwt.verify(token, "bruce", (err, decoded) => {
//     decoded
//       ? res.status(200).send("User Details")
//       : res.status(400).send({ msg: err.message });
//   });
// });

// userrouter.get("/moviedata", (req, res) => {
//   const { token } = req.query;
//   jwt.verify(token, "bruce", (err, decoded) => {
//     decoded
//       ? res.status(200).send("Movie")
//       : res.status(400).send({ msg: err.message });
//   });
// });

module.exports = { userrouter };
