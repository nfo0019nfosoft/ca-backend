const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getVendorStats,
  getUserStats
} = require("../controllers/adminController");

router.post("/login", adminLogin);
router.get("/vendor-stats",getVendorStats);
router.get("/user-stats",userStats);

module.exports = router;