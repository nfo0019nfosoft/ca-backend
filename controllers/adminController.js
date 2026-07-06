const jwt = require("jsonwebtoken");

const Vendor = require("../models/Vendor");
const User = require("../models/User");
const Enquiry = require("../models/Enquiry");
const Ticket = require("../models/Ticket");
const Consultation = require("../models/Consultation");

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

    const totalLeads = await Enquiry.countDocuments();

    const newLeads = await Enquiry.countDocuments({
      status: "new"
    });

    const contactedLeads = await Enquiry.countDocuments({
      status: "contacted"
    });

    const qualifiedLeads = await Enquiry.countDocuments({
      status: "qualified"
    });

    const convertedLeads = await Enquiry.countDocuments({
      status: "converted"
    });

    const lostLeads = await Enquiry.countDocuments({
      status: "lost"
    });

    res.status(200).json({

      success: true,

      totalLeads,

      newLeads,

      contactedLeads,

      qualifiedLeads,

      convertedLeads,

      lostLeads

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





exports.getAllLeads = async (req, res) => {

  try {

    const enquiries = await Enquiry.find()

      .populate(
        "vendorId",
        "fullName"
      )

      .populate(
        "userId",
        "fullName email mobile businessName country"
      )

      .sort({
        createdAt: -1
      });

    res.status(200).json({

      success: true,

      enquiries

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};













exports.deleteLead = async (req,res)=>{

  try{

    await Enquiry.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success:true,
      message:"Lead deleted successfully"
    });

  }

  catch(err){

    res.status(500).json({
      success:false,
      message:err.message
    });

  }

};















const Blog = require("../models/Blog");


// =====================
// ALL BLOGS
// =====================

exports.getAllBlogs = async (req, res) => {

  try {

    const blogs = await Blog.find()
      .sort({ createdAt: -1 });

    res.status(200).json({

      success: true,
      totalBlogs: blogs.length,
      blogs

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,
      message: err.message

    });

  }

};













exports.getSupportHeader =
async (req, res) => {

  try {

    const totalTickets =
      await Ticket.countDocuments();

    res.status(200).json({

      success: true,

      notificationCount: 0,

      ticketCount:
        totalTickets,

      adminPhoto:
        "/avatar.png",

      adminName:
        "Super Admin",

      adminRole:
        "Admin"

    });

  }

  catch (err) {

    res.status(500).json({
      success:false,
      message:err.message
    });

  }

};







exports.getSupportStats =
async (req, res) => {

  try {

    const totalTickets =
      await Ticket.countDocuments();

    const openTickets =
      await Ticket.countDocuments({
        status: "Open"
      });

    const inProgress =
      await Ticket.countDocuments({
        status: "In Progress"
      });

    const resolved =
      await Ticket.countDocuments({
        status: "Resolved"
      });

    const closed =
      await Ticket.countDocuments({
        status: "Closed"
      });

    res.status(200).json({
      success: true,

      stats: {
        totalTickets,
        openTickets,
        inProgress,
        resolved,
        closed
      }
    });

  }

  catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};










exports.getAllTickets =
async (req, res) => {

  try {

    const tickets =
      await Ticket.find()
      .populate(
        "userId",
        "name email"
      )
      .populate(
        "vendorId",
        "name email"
      )
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      tickets
    });

  }

  catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};
















exports.getAdminAppointments =
async (req, res) => {

    try {

        const appointments =
        await Consultation.find()

        .populate(
            "vendorId",
            "fullName name firmName photo"
        )

        .populate(
            "userId",
            "fullName name photo email mobile"
        )

        .sort({
            appointmentDate: -1
        });

        res.status(200).json({
            success: true,
            appointments
        });

    }

    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};












exports.getAdminAppointments =
async (req, res) => {

    try {

        const appointments =
        await Consultation.find()

        .populate(
            "vendorId",
            "fullName firmName name photo"
        )

        .populate(
            "userId",
            "fullName name photo"
        )

        .sort({
            createdAt: -1
        });

        console.log(
            appointments
        );

        res.status(200).json({
            success: true,
            appointments
        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};









exports.getAppointmentStats =
async (req, res) => {

    try {

        const totalAppointments =
        await Consultation.countDocuments();

        const completedAppointments =
        await Consultation.countDocuments({
            status: "completed"
        });

        const scheduledAppointments =
        await Consultation.countDocuments({
            status: "upcoming"
        });

        const cancelledAppointments =
        await Consultation.countDocuments({
            status: "cancelled"
        });

        const noShowAppointments =
        await Consultation.countDocuments({
            status: "no-show"
        });

        const completionRate =
        totalAppointments > 0
        ?
        Math.round(
            (
                completedAppointments /
                totalAppointments
            ) * 100
        )
        :
        0;

        res.status(200).json({

            success: true,

            stats: {

                totalAppointments,

                completedAppointments,

                scheduledAppointments,

                cancelledAppointments,

                noShowAppointments,

                completionRate

            }

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};