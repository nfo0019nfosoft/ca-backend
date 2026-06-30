const express = require("express");

const router = express.Router();

const {
  getRecentActivities,
  getRecommendations
} = require(
  "../controllers/dashboardController"
);

router.get(
  "/activities/:userId",
  getRecentActivities
);

router.get(
  "/recommendations/:userId",
  getRecommendations
);

module.exports = router;