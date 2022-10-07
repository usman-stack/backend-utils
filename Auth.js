const User = require("../models/User");
const Profiles = require("../models/Profiles");
const mailer = require("../utils/mailer");
const constant = require("../constants/ConstantMessages");
const userHelper = require("../helpers/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**SignUp */
exports.signUpUser = async (req, res) => {
  try {
    req.body.email = req.body.email.toLowerCase();
    let getUser = await User.findOne({ email: req.body.email });
    if (getUser) {
      return res
        .status(400)
        .send({ status: false, message: constant.ALREADY_REGISTERED });
    }
    req.body.status = constant.ACTIVE;
    req.body.isDeleted = false;
    const user = await User.create(req.body);
    req.body.activeRole = req.body.role;
    req.body.user = user._id;
    const profile = await Profiles.create(req.body);
    if (!user) {
      return res
        .status(500)
        .json({ status: false, message: constant.SERVER_ERROR });
    }
    // await mailer.signUpEmail(req.body.email);

    return res.status(201).json({
      status: true,
      message: constant.NEW_USER_CREATED + " " + req.body.email
    });
  } catch (error) {
    console.log("Error!", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

/**login */
exports.login = async (req, res) => {
  try {
    let foundUser = await User.findOne({ email: req.body.email.toLowerCase() });
    // console.log("TESAFDAFA:::", foundUser);
    //   foundUser = foundUser[0];
    if (!foundUser) {
      return res.status(500).json({ message: constant.INVALID_USER });
    }
    /**is User status is Active or blocked*/
    if (foundUser.status !== "active") {
      return res.status(500).json({ message: constant.USER_BLOCKED });
    }
    foundUser.comparePassword(req.body.password, async (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (isMatch) {
        let role = await Profiles.findOne(
          { user: foundUser._id, activeRole:{$not:/^$/} },
          "activeRole"
        );
        foundUser = foundUser.toObject();
        foundUser.role = role.activeRole;
        delete foundUser.password;
        let getToken = await userHelper.loginToken(foundUser);
        return res.status(200).send(getToken);
      }
      return res.status(401).json({ message: constant.INVALID_CREDENTIALS });
    });
  } catch (error) {
    console.log("ERROR:::", error);
    return res.status(500).json({ message: error.message });
  }
};

/**Logout on the basis of JWT token */
exports.logout = async (req, res) => {
  try {
    let token = req.headers["authorization"];
    if (!token || !token.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ status: false, message: constant.TOKEN_ERR });
    }
    var accessToken = token.split(" ")[1];
    console.log("TOKEN:::::::::", accessToken);
    var decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    let updateUser = await User.updateOne(
      { _id: decoded.id },
      { tokenStatus: false }
    );
    // console.log("UPDATE RESPONSE::", updateUser);
    if (!updateUser)
      return res
        .status(500)
        .json({ status: false, message: constant.SERVER_ERROR });
    return res
      .status(200)
      .send({ status: true, message: constant.LOGOUT_SUCCESS });
  } catch (error) {
    console.log("ERROR:::", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};
