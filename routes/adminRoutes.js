const express = require("express");
const router = express.Router();

const {
  adminLogin,
   getVendorStats
} = require("../controllers/adminController");

router.post("/login", adminLogin);
router.get("/vendor-stats",getVendorStats);

module.exports = router;