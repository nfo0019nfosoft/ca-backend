console.log("✅ Vendor Routes Loaded");
const Vendor = require("../models/Vendor");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const vendorSettingsRoutes = require("./vendorSettingsRoutes");

const {
  registerVendor,
  loginVendor,
  getProfile,
  updateProfile,
  updateServices,
  saveKyc,
  savePhoto,
  getAllVendors,
  getVendorById,
  updateBankDetails,
  searchVendors,
  getVendorCalendar,
  getVendorAppointments,
  getAvailability,
  saveAvailability,
  getCities,
   updateAppointmentStatus
} = require("../controllers/vendorAuthController");

/* -------------------------
   TEST ROUTE
------------------------- */
router.get("/test", (req, res) => {
  console.log("✅ TEST ROUTE HIT");

  res.status(200).json({
    success: true,
    message: "Vendor Route Working",
  });
});

/* -------------------------
   AUTH ROUTES
------------------------- */
router.post("/register", registerVendor);
router.post("/login", loginVendor);

/* -------------------------
   PROFILE ROUTES
------------------------- */
router.get(
  "/profile",
  (req, res, next) => {
    console.log("✅ PROFILE ROUTE HIT");
    next();
  },
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  (req, res, next) => {
    console.log("✅ UPDATE PROFILE ROUTE HIT");
    next();
  },
  authMiddleware,
  updateProfile
);

/* -------------------------
   SERVICES
------------------------- */
router.put(
  "/services",
  authMiddleware,
  updateServices
);

/* -------------------------
   KYC
------------------------- */
router.post(
  "/kyc",
  authMiddleware,
  upload.fields([
    { name: "panCard", maxCount: 1 },
    { name: "aadhaarCard", maxCount: 1 },
    { name: "photograph", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
    { name: "caCertificate", maxCount: 1 },
  ]),
  saveKyc
);

/* -------------------------
   PHOTO
------------------------- */
router.post(
  "/photo",
  authMiddleware,
  upload.single("photo"),
  savePhoto
);



/* -------------------------
   SEARCH VENDORS
------------------------- */

router.get("/all-services", async (req, res) => {

  try {

    const vendors = await Vendor.find();

    const services = [
      ...new Set(
        vendors.flatMap(v =>
          v.services.map(s => s.serviceName)
        )
      )
    ];

    res.status(200).json(services);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});






/* -------------------------
   SEARCH VENDORS
------------------------- */
router.get("/search", searchVendors);










/* -------------------------
   GET ALL VENDORS
------------------------- */
router.get("/", getAllVendors);





router.get(
  "/calendar/:vendorId",
  getVendorCalendar
);



router.get(
  "/appointments/:vendorId",
  getVendorAppointments
);





router.put(
  "/availability",
  authMiddleware,
  saveAvailability
);

router.get(
  "/availability",
  authMiddleware,
  getAvailability
);

// =========================
// update bank details
// =========================
router.put(
  "/update-bank-details",
  authMiddleware,
  updateBankDetails
);





router.use(
  "/settings",
  vendorSettingsRoutes
);



router.get("/cities", getCities);

/* -------------------------
   GET SINGLE VENDOR
   ALWAYS KEEP LAST
------------------------- */
router.get("/:id", getVendorById);
router.put(
    "/appointments/:id/status",
    updateAppointmentStatus
);

module.exports = router;