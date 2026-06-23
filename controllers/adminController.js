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

    // Dashboard Cards

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


    // Chart Data (Last 7 Days)

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















exports.userStats = async (req, res) => {

  try {

    const totalUsers = await User.countDocuments();

    const activeUsers = await User.countDocuments({
      isBlocked: false
    });

    const blockedUsers = await User.countDocuments({
      isBlocked: true
    });

    const verifiedUsers = await User.countDocuments({
      isVerified: true
    });

    const newUsers = await User.countDocuments({
      createdAt: {
        $gte: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000
        )
      }
    });

    res.json({

      success: true,

      totalUsers,

      activeUsers,

      blockedUsers,

      emailVerifiedUsers: verifiedUsers,

      newUsers,

      notificationCount: 16,

      adminName: "Super Admin",

      adminPhoto:
        "https://i.pravatar.cc/100"

    });

  }

  catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};