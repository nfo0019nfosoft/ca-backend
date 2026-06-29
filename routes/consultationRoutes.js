const express = require("express");
console.log(
  "Consultation Routes Loaded"
);

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  bookConsultation,
  getUserConsultations,
  getVendorConsultations,
  updateConsultationStatus,
} = require("../controllers/consultationController");


// ===========================
// Create Consultation
// ===========================
router.post(
  "/book",
  auth,
  bookConsultation
);


// ===========================
// Get User Appointments
// ===========================
router.get(
  "/user/:userId",
  auth,
  getUserConsultations
);


// ===========================
// Get Vendor Appointments
// ===========================
router.get(
  "/vendor/:vendorId",
  auth,
  getVendorConsultations
);


// ===========================
// Update Appointment Status
// ===========================
router.put(
  "/status/:id",
  auth,
  updateConsultationStatus
);

module.exports = router;