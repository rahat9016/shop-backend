const shortid = require("shortid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
exports.Signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, number } = req.body;
      const hash_password = await bcrypt.hash(password, 10);
      const _newUser = new User({
        firstName,
        lastName,
        email,
        password: hash_password,
        number: number,
        userName: firstName + shortid.generate(),
        role: "user",
      });
      _newUser
        .save()
        .then((data) => {
          if (data) {
            res.status(201).json({
              message: "user created successful",
              user: data,
            });
          }
        })
        .catch((error) => {
          console.log(error)
          res.status(400).json({ error: "Something went wrong ", error });
        });
  } catch (error) {
    if (error) return res.status(400).json({ error: "Something went wrong" });
  }
};
//Signing page handler
exports.Signing = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      if (
        (await bcrypt.compare(req.body.password, user.password)) &&
        user.role === "user"
      ) {
        const token = jwt.sign(
          {
            _id: user._id,
            role: user.role,
          },
          process.env.SECRET,
          {
            expiresIn: "1d",
          }
        );
        const { _id, firstName, lastName, role, email, number } = user;

        res.cookie("token", token, { expiresIn: "1d" });
        if (token) {
          res.status(200).json({
            token,
            user: {
              _id,
              firstName,
              lastName,
              email,
              role,
              number,
            },
          });
        }
      } else {
        res.status(400).json({
          errors: "Invalid password!",
        });
      }
    } else {
      res.status(400).json({
        errors: "This is not user",
      });
    }
  } catch (error) {
    return res.status(400).json({ errors: error });
  }
};
exports.signOut = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "Signout Successful!",
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};
