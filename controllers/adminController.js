const jwt = require("jsonwebtoken");

const Vendor = require("../models/Vendor");
const User = require("../models/User");
const Lead = require("../models/Lead");

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

    res.status(200).json({

      success: true,
      token,
      role: "admin"

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,
      message: err.message

    });

  }

};


// =====================
// VENDOR STATS
// =====================

exports.getVendorStats = async (req, res) => {

  try {

    const totalVendors = await Vendor.countDocuments();

    const activeVendors = await Vendor.countDocuments({
      available: true
    });

    const pendingApproval = await Vendor.countDocuments({
      isVerified: false
    });

    const blockedVendors = await Vendor.countDocuments({
      available: false
    });

    const verifiedVendors = await Vendor.countDocuments({
      isVerified: true
    });

    const experiencedVendors = await Vendor.countDocuments({
      experience: {
        $gte: 5
      }
    });


    let chartLabels = [];

    let totalVendorChart = [];

    let activeVendorChart = [];

    let pendingVendorChart = [];

    let blockedVendorChart = [];


    for (let i = 6; i >= 0; i--) {

      const start = new Date();

      start.setDate(start.getDate() - i);

      start.setHours(0, 0, 0, 0);

      const end = new Date(start);

      end.setHours(23, 59, 59, 999);

      chartLabels.push(

        start.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric"
          }
        )

      );


      totalVendorChart.push(

        await Vendor.countDocuments({

          createdAt: {

            $lte: end

          }

        })

      );


      activeVendorChart.push(

        await Vendor.countDocuments({

          available: true,

          createdAt: {

            $lte: end

          }

        })

      );


      pendingVendorChart.push(

        await Vendor.countDocuments({

          isVerified: false,

          createdAt: {

            $lte: end

          }

        })

      );


      blockedVendorChart.push(

        await Vendor.countDocuments({

          available: false,

          createdAt: {

            $lte: end

          }

        })

      );

    }


    res.status(200).json({

      success: true,

      totalVendors,

      activeVendors,

      pendingApproval,

      blockedVendors,

      verifiedVendors,

      experiencedVendors,

      chartLabels,

      totalVendorChart,

      activeVendorChart,

      pendingVendorChart,

      blockedVendorChart

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};




// =====================
// USER STATS
// =====================

exports.userStats = async (req, res) => {

  try {

    const totalUsers = await User.countDocuments();

    const activeUsers = await User.countDocuments({
      accountStatus: "active"
    });

    const suspendedUsers = await User.countDocuments({
      accountStatus: "suspended"
    });

    const verifiedUsers = await User.countDocuments({
      emailVerified: true
    });

    const newUsers = await User.countDocuments({
      createdAt: {
        $gte: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000
        )
      }
    });

    const unreadNotifications = await User.aggregate([
      {
        $unwind: "$notifications"
      },
      {
        $match: {
          "notifications.isRead": false
        }
      },
      {
        $count: "count"
      }
    ]);

    res.status(200).json({

      success: true,

      totalUsers,

      activeUsers,

      suspendedUsers,

      emailVerifiedUsers: verifiedUsers,

      newUsers,

      notificationCount:
        unreadNotifications.length > 0
          ? unreadNotifications[0].count
          : 0,

      adminName: "Super Admin",

      adminPhoto: "/images/avatar.png"

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};


// =====================
// ALL USERS
// =====================

exports.getAllUsers = async (req, res) => {

  try {

    const users = await User.find()
      .sort({
        createdAt: -1
      });

    res.status(200).json({

      success: true,

      users

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};



// =====================
// LEAD STATS
// =====================

exports.getLeadStats = async (req, res) => {

  try {

    const totalLeads = await Lead.countDocuments();

    const newLeads = await Lead.countDocuments({
      status: "new"
    });

    const assignedLeads = await Lead.countDocuments({
      status: "assigned"
    });

    const inProgressLeads = await Lead.countDocuments({
      status: "in_progress"
    });

    const convertedLeads = await Lead.countDocuments({
      status: "converted"
    });

    const closedLeads = await Lead.countDocuments({
      status: "closed"
    });

    const cancelledLeads = await Lead.countDocuments({
      status: "cancelled"
    });

    res.status(200).json({

      success: true,

      totalLeads,

      newLeads,

      assignedLeads,

      inProgressLeads,

      convertedLeads,

      closedLeads,

      cancelledLeads

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};









// =====================
// DELETE USER
// =====================

exports.deleteUser = async (req, res) => {

  try {

    await User.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({

      success: true,

      message: "User deleted successfully"

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};













// =====================
// DELETE VENDOR
// =====================

exports.deleteVendor = async (
  req,
  res
) => {

  try {

    await Vendor.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({

      success: true,

      message:
        "Vendor deleted successfully"

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};
















// =====================
// ENQUIRY
// =====================



const Enquiry = require("../models/Enquiry");

exports.getAllLeads = async (req, res) => {
  try {

    const enquiries = await Enquiry.find()
      .populate("vendorId", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      enquiries
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};