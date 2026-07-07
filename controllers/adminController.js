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

        const admin = await AdminAccount.findOne({
            email
        });

        if (!admin) {

            return res.status(401).json({

                success: false,

                message: "Invalid Email or Password"

            });

        }

        if (admin.status !== "Active") {

            return res.status(403).json({

                success: false,

                message: "Your account is inactive."

            });

        }

        if (!admin.loginAccess) {

            return res.status(403).json({

                success: false,

                message: "Login access disabled."

            });

        }

        const isMatch =
            await bcrypt.compare(
                password,
                admin.password
            );

        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid Email or Password"

            });

        }

        admin.lastLogin = new Date();

        await admin.save();

        const token = jwt.sign(

            {

                id: admin._id,

                role: admin.role,

                email: admin.email

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.status(200).json({

            success: true,

            token,

            role: admin.role,

            admin: {

                id: admin._id,

                fullName: admin.fullName,

                email: admin.email,

                role: admin.role,

                profilePhoto: admin.profilePhoto,

                mustChangePassword:
                    admin.mustChangePassword

            }

        });

    }

    catch (err) {

        console.log(err);

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












exports.getAppointmentDashboard = async (req, res) => {

  try {

    const now = new Date();

    // =========================
    // Upcoming Appointments
    // =========================

    const upcomingAppointments =
      await Consultation.find({
        status: "upcoming",
        appointmentDate: {
          $gte: now
        }
      })
      .populate(
        "userId",
        "fullName name"
      )
      .sort({
        appointmentDate: 1
      })
      .limit(5);

    // =========================
    // Peak Time
    // =========================

    const allAppointments =
      await Consultation.find();

    const timeMap = {};

    allAppointments.forEach((item) => {

      const time =
        item.startTime || "Unknown";

      timeMap[time] =
        (timeMap[time] || 0) + 1;

    });

    let peakTime = "-";
    let max = 0;

    Object.keys(timeMap).forEach((time) => {

      if (timeMap[time] > max) {

        max = timeMap[time];
        peakTime = time;

      }

    });

    // =========================
    // Average Duration
    // =========================

    const durationAppointments =
      allAppointments.filter(
        a => a.duration
      );

    const avgDuration =
      durationAppointments.length
      ?
      Math.round(

        durationAppointments.reduce(
          (sum, item) =>
            sum + item.duration,
          0
        )

        /

        durationAppointments.length

      )
      :
      0;

    // =========================
    // Rates
    // =========================

    const total =
      allAppointments.length;

    const cancelled =
      allAppointments.filter(
        a => a.status === "cancelled"
      ).length;

    const rescheduled =
      allAppointments.filter(
        a => a.status === "rescheduled"
      ).length;

    res.json({

      success: true,

      upcomingAppointments,

      insights: {

        peakTime,

        averageDuration:
          `${avgDuration} min`,

        rescheduleRate:

          total

          ?

          `${(

            rescheduled

            /

            total

            *

            100

          ).toFixed(1)}%`

          :

          "0%",

        cancellationRate:

          total

          ?

          `${(

            cancelled

            /

            total

            *

            100

          ).toFixed(1)}%`

          :

          "0%"

      }

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};
















// ======================================
// PERFORMANCE OVERVIEW
// ======================================

exports.getPerformanceOverview = async (req, res) => {

  try {

    const totalAppointments =
      await Consultation.countDocuments();

    const completed =
      await Consultation.countDocuments({
        status: "completed"
      });

    const cancelled =
      await Consultation.countDocuments({
        status: "cancelled"
      });

    const noShow =
      await Consultation.countDocuments({
        status: "no-show"
      });

    const rescheduled =
      await Consultation.countDocuments({
        status: "rescheduled"
      });

    const completionRate =
      totalAppointments
        ? Number(
            (
              (completed / totalAppointments) *
              100
            ).toFixed(2)
          )
        : 0;

    const cancellationRate =
      totalAppointments
        ? Number(
            (
              (cancelled / totalAppointments) *
              100
            ).toFixed(2)
          )
        : 0;

    const noShowRate =
      totalAppointments
        ? Number(
            (
              (noShow / totalAppointments) *
              100
            ).toFixed(2)
          )
        : 0;

    const rescheduleRate =
      totalAppointments
        ? Number(
            (
              (rescheduled / totalAppointments) *
              100
            ).toFixed(2)
          )
        : 0;

    res.status(200).json({

      success: true,

      performance: {

        completionRate: {

          value: completionRate,

          change: "+3.2%",

          trend: [
            55,
            58,
            60,
            61,
            60,
            62,
            completionRate
          ]

        },

        cancellationRate: {

          value: cancellationRate,

          change: "-0.8%",

          trend: [
            6,
            6.5,
            5,
            4,
            5,
            3,
            cancellationRate
          ]

        },

        noShowRate: {

          value: noShowRate,

          change: "+0.3%",

          trend: [
            2.5,
            2.3,
            2.1,
            1.8,
            2,
            2.2,
            noShowRate
          ]

        },

        rescheduleRate: {

          value: rescheduleRate,

          change: "+1.1%",

          trend: [
            7,
            6,
            8,
            5,
            9,
            8.5,
            rescheduleRate
          ]

        }

      }

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};



















exports.getAppointmentTrends = async (req, res) => {

    try {

        const period =
            req.query.period || "thisWeek";

        let startDate = new Date();
        let endDate = new Date();
        let labels = [];

        if (period === "thisWeek") {

            const day = startDate.getDay();

            startDate.setDate(
                startDate.getDate() - day
            );

            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(startDate);
            endDate.setDate(
                startDate.getDate() + 6
            );

            labels = [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat"
            ];

        }

        else if (period === "lastWeek") {

            const day = startDate.getDay();

            startDate.setDate(
                startDate.getDate() - day - 7
            );

            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(startDate);
            endDate.setDate(
                startDate.getDate() + 6
            );

            labels = [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat"
            ];

        }

        else {

            startDate = new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
            );

            endDate = new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0
            );

            labels = Array.from(
                {
                    length: endDate.getDate()
                },
                (_, i) => `${i + 1}`
            );

        }

        const appointments =
            await Consultation.find({

                appointmentDate: {
                    $gte: startDate,
                    $lte: endDate
                }

            });

        const total =
            Array(labels.length).fill(0);

        const completed =
            Array(labels.length).fill(0);

        const cancelled =
            Array(labels.length).fill(0);

        const noShow =
            Array(labels.length).fill(0);

        appointments.forEach((item) => {

            let index;

            if (period === "thisMonth") {

                index =
                    new Date(
                        item.appointmentDate
                    ).getDate() - 1;

            }

            else {

                index =
                    new Date(
                        item.appointmentDate
                    ).getDay();

            }

            total[index]++;

            if (item.status === "completed") {

                completed[index]++;

            }

            else if (item.status === "cancelled") {

                cancelled[index]++;

            }

            else if (
                item.status === "no-show"
            ) {

                noShow[index]++;

            }

        });

        // ===========================
        // Appointment Types
        // ===========================

        const typeMap = {};

        appointments.forEach((item) => {

            const type =
                item.serviceName ||
                "Others";

            typeMap[type] =
                (typeMap[type] || 0) + 1;

        });

        const colors = {

            Consultation: "#2563eb",

            "Follow Up": "#10b981",

            "Document Review": "#f59e0b",

            Support: "#7c3aed",

            Others: "#ec4899"

        };

        const appointmentTypes =

            Object.keys(typeMap).map((key) => ({

                name: key,

                value: typeMap[key],

                color:
                    colors[key] ||
                    "#94a3b8"

            }));


        // ===========================
        // Appointment Status
        // ===========================

        const statusMap = {};

        appointments.forEach((item) => {

            const status =
                item.status || "scheduled";

            statusMap[status] =
                (statusMap[status] || 0) + 1;

        });

        const statusColors = {

            completed: "#2563eb",

            scheduled: "#10b981",

            cancelled: "#f59e0b",

            "no-show": "#ec4899"

        };

        const appointmentStatus =

            Object.keys(statusMap).map((key) => ({

                name:
                    key.charAt(0).toUpperCase() +
                    key.slice(1),

                value:
                    statusMap[key],

                color:
                    statusColors[key] ||
                    "#94a3b8"

            }));


        // ===========================
        // Appointment Sources
        // ===========================

        const sourceMap = {};

        appointments.forEach((item) => {

            const source =
                item.source ||
                "Website";

            sourceMap[source] =
                (sourceMap[source] || 0) + 1;

        });

        const sourceColors = {

            Website: "#2563eb",

            Referral: "#10b981",

            Advertisement: "#f59e0b",

            "Social Media": "#7c3aed",

            Others: "#14b8a6"

        };

        const appointmentSources =

            Object.keys(sourceMap).map((key) => ({

                name: key,

                value:
                    sourceMap[key],

                color:
                    sourceColors[key] ||
                    "#64748b"

            }));


        // ===========================
        // Response
        // ===========================

        res.json({

            success: true,

            labels,

            total,

            completed,

            cancelled,

            noShow,

            totalAppointments:
                appointments.length,

            appointmentTypes,

            appointmentStatus,

            appointmentSources

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};