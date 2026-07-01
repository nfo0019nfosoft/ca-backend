const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
  getVendorSettings,
  updateVendorSettings,
  changeVendorPassword
} = require(
  "../controllers/vendorSettingsController"
);

/* ==========================
   GET SETTINGS
========================== */

router.get(
  "/",
  authMiddleware,
  getVendorSettings
);

/* ==========================
   UPDATE SETTINGS
========================== */

router.put(
  "/",
  authMiddleware,
  updateVendorSettings
);

/* ==========================
   CHANGE PASSWORD
========================== */

router.put(
  "/change-password",
  authMiddleware,
  changeVendorPassword
);

module.exports = router;