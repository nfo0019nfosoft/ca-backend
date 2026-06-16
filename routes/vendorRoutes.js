console.log("✅ Vendor Routes Loaded");

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  registerVendor,
  loginVendor,
  getProfile,
  updateProfile,
  updateServices
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


router.put(
  "/services",
  authMiddleware,
  updateServices
);

module.exports = router;