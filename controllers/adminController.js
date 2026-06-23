const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");

// =====================
// ADMIN LOGIN
// =====================
exports.adminLogin = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {

      return res.status(401).json({
        success: false,
        message: "Invalid Admin Credentials"
      });

    }

    const token = jwt.sign(
      {
        role: "admin"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    return res.status(200).json({
      success: true,
      token,
      role: "admin"
    });

  }

  catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================
// VENDOR STATS
// =====================
exports.getVendorStats = async (req, res) => {

  try {

    const totalVendors =
      await Vendor.countDocuments();

    const activeVendors =
      await Vendor.countDocuments({
        available: true
      });

    const pendingApproval =
      await Vendor.countDocuments({
        isVerified: false
      });

    const blockedVendors =
      await Vendor.countDocuments({
        available: false
      });

    const verifiedVendors =
      await Vendor.countDocuments({
        isVerified: true
      });

    const experiencedVendors =
      await Vendor.countDocuments({
        experience: {
          $gte: 5
        }
      });

    res.status(200).json({
      success: true,
      totalVendors,
      activeVendors,
      pendingApproval,
      blockedVendors,
      verifiedVendors,
      experiencedVendors
    });

  }

  catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};