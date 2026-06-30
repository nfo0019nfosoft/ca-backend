const Vendor = require("../models/Vendor");
const Enquiry = require("../models/Enquiry");
const Consultation = require("../models/Consultation");
const Notification = require("../models/Notification");
const Activity = require("../models/Activity");


// =====================================
// Vendor Dashboard
// =====================================

exports.getVendorDashboard = async (req, res) => {

  try {

    const { vendorId } = req.params;

    // =========================
    // Vendor Details
    // =========================

    const vendor =
      await Vendor.findById(vendorId);

    // =========================
    // Leads
    // =========================

    const totalLeads =
      await Enquiry.countDocuments({
        vendorId
      });

    const newLeads =
      await Enquiry.countDocuments({
        vendorId,
        status: "new"
      });

    const activeLeads =
      await Enquiry.countDocuments({
        vendorId,
        status: {
          $in: [
            "contacted",
            "qualified",
            "proposal_sent"
          ]
        }
      });

    const convertedLeads =
      await Enquiry.countDocuments({
        vendorId,
        status: "converted"
      });

    const rejectedLeads =
      await Enquiry.countDocuments({
        vendorId,
        status: "lost"
      });

    // =========================
    // Today's Appointments
    // =========================

    const startOfDay = new Date();
    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    const endOfDay = new Date();
    endOfDay.setHours(
      23,
      59,
      59,
      999
    );

    const todayAppointments =
      await Consultation.countDocuments({

        vendorId,

        appointmentDate: {
          $gte: startOfDay,
          $lte: endOfDay
        }

      });

    // =========================
    // Upcoming Appointments
    // =========================

    const upcomingAppointments =
      await Consultation.find({

        vendorId,

        status: "upcoming"

      })

      .populate(
        "userId",
        "fullName name photo"
      )

      .sort({
        appointmentDate: 1
      })

      .limit(5);

    // =========================
    // Revenue
    // =========================

    const paidConsultations =
      await Consultation.find({
        vendorId,
        paymentStatus: "paid"
      });

    const monthlyRevenue =
      paidConsultations.reduce(
        (
          total,
          item
        ) =>
          total +
          (item.amount || 0),
        0
      );

    // =========================
    // Monthly Revenue Graph
    // =========================

    const monthlyRevenueData =
      await Consultation.aggregate([

        {
          $match: {

            vendorId:
              vendor._id,

            paymentStatus:
              "paid"

          }
        },

        {
          $group: {

            _id: {
              day: {
                $dayOfMonth:
                  "$createdAt"
              }
            },

            revenue: {
              $sum:
                "$amount"
            }

          }
        },

        {
          $sort: {
            "_id.day": 1
          }
        }

      ]);

    // =========================
    // Notifications
    // =========================

    const notifications =
      await Notification.find({

        vendorId

      })

      .sort({
        createdAt: -1
      })

      .limit(5);

    const unreadNotifications =
      await Notification.countDocuments({

        vendorId,

        isRead: false

      });

    // =========================
    // Activities
    // =========================

    const activities =
      await Activity.find({

        vendorId

      })

      .sort({
        createdAt: -1
      })

      .limit(5);

    // =========================
    // Response
    // =========================

    res.status(200).json({

      success: true,

      vendor,

      stats: {

        totalLeads,

        newLeads,

        activeLeads,

        convertedLeads,

        rejectedLeads,

        todayAppointments,

        monthlyRevenue,

        unreadNotifications

      },

      monthlyRevenueData,

      upcomingAppointments,

      notifications,

      activities

    });

  }
  catch (error) {

    console.log(
      "VENDOR DASHBOARD ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Dashboard fetch failed"

    });

  }

};


// =====================================
// Vendor Calendar
// =====================================

exports.getVendorCalendar = async (
  req,
  res
) => {

  try {

    const { vendorId } =
      req.params;

    const appointments =
      await Consultation.find({

        vendorId

      })

      .populate(
        "userId",
        "fullName name photo"
      )

      .sort({
        appointmentDate: 1
      });

    res.status(200).json({

      success: true,

      appointments

    });

  }
  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Calendar fetch failed"

    });

  }

};