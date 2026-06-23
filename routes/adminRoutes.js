const express = require("express");

const router = express.Router();

const {

  adminLogin,

  getVendorStats,

  userStats,

  getAllUsers,

  getLeadStats,

  getAllLeads

} = require("../controllers/adminController");


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
// LEADS
// =====================

router.get(
  "/leads",
  getAllLeads
);


module.exports = router;