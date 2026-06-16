const User = require("../models/User");
const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   REGISTER USER
========================= */
exports.register = async (req, res) => {
  try {

    const {
      name,
      email,
      phone,
      password
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({
        name,
        email,
        phone,
        password: hashedPassword
      });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    return res.status(201).json({
      success: true,
      token,
      user
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

/* =========================
   LOGIN USER / VENDOR
========================= */

exports.login = async (req, res) => {
  try {

    const { phone, role } = req.body;

    let account;

    if (role === "vendor") {

      account = await Vendor.findOne({
        mobile: phone
      });

      if (!account) {

        account = await Vendor.create({
          fullName: "Vendor",
          email: `${phone}@vendor.com`,
          mobile: phone,
          password: "temp123",
          role: "vendor"
        });

      }

    } else {

      account = await User.findOne({
        phone
      });

      if (!account) {

        account = await User.create({
          name: "User",
          email: `${phone}@caconnect.com`,
          phone,
          password: "temp123",
          role: "user"
        });

      }
    }

    const token = jwt.sign(
      {
        id: account._id,
        role: role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: account
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

/* =========================
   PROFILE
========================= */
exports.getProfile = async (
  req,
  res
) => {
  try {

    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};