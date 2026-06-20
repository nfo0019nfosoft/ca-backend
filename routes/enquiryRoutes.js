const express = require("express");
const router = express.Router();

const Enquiry =
  require("../models/Enquiry");

router.post("/", async (req, res) => {
  try {
    const enquiry =
      await Enquiry.create(req.body);

    res.status(201).json({
      success: true,
      enquiry,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const enquiries =
      await Enquiry.find({
        vendorId: req.params.vendorId,
      }).sort({
        createdAt: -1,
      });

    res.json(enquiries);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;