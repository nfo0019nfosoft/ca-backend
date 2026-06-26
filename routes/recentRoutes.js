const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  addRecentView,
  getRecentViewed,
} = require("../controllers/recentController");

router.post("/view", auth, addRecentView);
router.get("/", auth, getRecentViewed);

module.exports = router;