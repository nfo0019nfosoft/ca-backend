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

  getAllBlogs


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

module.exports = router;