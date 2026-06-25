const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  addToCompare,
  getCompare,
  removeCompare,
} = require("../controllers/compareController");

router.post("/add", auth, addToCompare);

router.get("/", auth, getCompare);

router.delete("/:vendorId", auth, removeCompare);

module.exports = router;