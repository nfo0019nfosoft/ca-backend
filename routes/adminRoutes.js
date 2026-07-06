const express = require("express");

const router = express.Router();






const {
  adminLogin,
  getVendorStats,
  userStats,
  getAllUsers,
  getLeadStats,
  getAllLeads,
  deleteUser,
  deleteVendor,
  deleteLead,
  getAllBlogs,
  getSupportHeader,
  getSupportStats,
  getAdminAppointments,
  getAppointmentStats
} = require("../controllers/adminController");

const {
  getAllTickets,
  getTicketById,
  replyTicket,
  updateTicketStatus,
  deleteTicket,
  
} = require("../controllers/ticketController");


// =====================
// ADMIN LOGIN
// =====================

router.post(
  "/login",
  adminLogin
);


// =====================
// DASHBOARD STATS
// =====================

router.get(
  "/vendor-stats",
  getVendorStats
);

router.get(
  "/user-stats",
  userStats
);

router.get(
  "/lead-stats",
  getLeadStats
);


// =====================
// USERS
// =====================

router.get(
  "/users",
  getAllUsers
);







// =====================
// DELETE USER
// =====================


router.delete(
  "/users/:id",
  deleteUser
);



// =====================
// DELETE VENDOR
// =====================


router.delete(
  "/vendors/:id",
  deleteVendor
);



// =====================
// LEADS
// =====================

router.get(
  "/leads",
  getAllLeads
);




// =====================
//  DELETE LEADS
// =====================

router.delete(
  "/leads/:id",
  deleteLead
);




// =====================
// BLOGS
// =====================

router.get(
  "/blogs",
  getAllBlogs
);


// =====================
// SUPPORT HEADER
// =====================

router.get(
  "/support-header",
  getSupportHeader
);

router.get(
  "/support-stats",
  getSupportStats
);


// =====================
// TICKETS
// =====================

// Get all tickets
router.get(
  "/tickets",
  getAllTickets
);

// Get single ticket details
router.get(
  "/tickets/:id",
  getTicketById
);

// Admin reply to ticket
router.post(
  "/tickets/:id/reply",
  replyTicket
);

// Update ticket status
router.put(
  "/tickets/:id/status",
  updateTicketStatus
);

// Delete ticket
router.delete(
  "/tickets/:id",
  deleteTicket
);


router.get(
  "/appointments",
  getAdminAppointments
);


router.get(
  "/appointment-stats",
  getAppointmentStats
);


module.exports = router;