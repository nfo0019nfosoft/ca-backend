const express = require("express");
const router = express.Router();

const User = require("../models/User");

const upload = require("../middleware/upload");

const authMiddleware =
require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  updateEmailPreferences,
  updateNotificationPreferences,
  changePassword,
  updatePrivacySettings,
  deleteAccount,
  downloadUserData
} = require("../controllers/authController");


/* =====================
   PROFILE
===================== */

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);


/* =====================
   EMAIL PREFERENCES
===================== */

router.put(
  "/email-preferences",
  authMiddleware,
  updateEmailPreferences
);

router.put(
  "/notification-preferences",
  authMiddleware,
  updateNotificationPreferences
);


/* =====================
   PROFILE PHOTO
===================== */

router.post(
  "/photo",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );

      user.profileImage =
        `/uploads/${req.file.filename}`;

      await user.save();

      res.json({
        success: true,
        profileImage:
          user.profileImage
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false
      });

    }

  }
);


/* =====================
   PASSWORD
===================== */

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);


/* =====================
   PRIVACY SETTINGS
===================== */

router.put(
  "/privacy-settings",
  authMiddleware,
  updatePrivacySettings
);


/* =====================
   DOWNLOAD USER DATA
===================== */

router.get(
  "/download-data",
  authMiddleware,
  downloadUserData
);


/* =====================
   DELETE ACCOUNT
===================== */

router.delete(
  "/delete-account",
  authMiddleware,
  deleteAccount
);


/* =====================
   DOCUMENT UPLOAD
===================== */

router.post(
  "/upload-document",
  authMiddleware,
  upload.single("document"),
  async (req, res) => {

    try {

      const {
        documentType
      } = req.body;

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {

        return res.status(404).json({
          success: false,
          message: "User not found"
        });

      }

      user.documents[
        documentType
      ] = req.file.filename;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Document uploaded successfully",
        file:
          req.file.filename
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
);

module.exports = router;