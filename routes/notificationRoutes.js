const express =
require("express");

const router =
express.Router();

const {
  getUserNotifications
}
=
require(
"../controllers/notificationController"
);

router.get(
"/user/:userId",
getUserNotifications
);

module.exports =
router;