const express = require("express");

const router = express.Router();

const {
  getVendorDashboard
} = require(
  "../controllers/vendorDashboardController"
);

router.get(
  "/dashboard/:vendorId",
  getVendorDashboard
);

module.exports = router;