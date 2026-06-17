const express = require("express");
const router = express.Router();

const User = require("../models/User");

const upload = require("../middleware/upload");

const authMiddleware =
require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
} = require("../controllers/authController");
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
          user.profileImage,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
      });

    }

  }
);










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
          message: "User not found",
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
          req.file.filename,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  }
);
module.exports = router;