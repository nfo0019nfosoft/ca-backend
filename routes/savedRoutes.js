const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  saveVendor,
  getSavedVendors,
  removeSavedVendor,
} = require("../controllers/savedVendorController");

router.post("/save", auth, saveVendor);

router.get("/save", auth, getSavedVendors);

router.delete("/save/:id", auth, removeSavedVendor);

module.exports = router;