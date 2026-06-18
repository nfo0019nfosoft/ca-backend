console.log("✅ Vendor Routes Loaded");

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

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
} = require("../controllers/vendorAuthController");

/* -------------------------
   GET ALL VENDORS
------------------------- */
router.get("/", getAllVendors);
router.get("/:id", getVendorById);

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

module.exports = router;