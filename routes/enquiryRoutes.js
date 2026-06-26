const express = require("express");
const router = express.Router();

const Enquiry = require("../models/Enquiry");

/* ===========================
      CREATE ENQUIRY
=========================== */

const upload = require("../middleware/upload");

router.post(
  "/",
  upload.array("documents", 10),
  async (req, res) => {

    try {

      console.log(req.body);
      console.log(req.files);

      const documents =
        req.files?.map(file => ({
          fileName: file.originalname,
          fileUrl: file.filename
        })) || [];

      const enquiry =
        await Enquiry.create({

          vendorId: req.body.vendorId,
          userId: req.body.userId,

          serviceName: req.body.serviceName,

          fullName: req.body.fullName,
          email: req.body.email,
          mobile: req.body.mobile,

          city: req.body.city,
          state: req.body.state,

          gstRequired: req.body.gstRequired,
          hearAboutUs: req.body.hearAboutUs,

          companyName: req.body.companyName,

          preferredContact:
            req.body.preferredContact,

          preferredTime:
            req.body.preferredTime,

          businessType:
            req.body.businessType,

          annualTurnover:
            req.body.annualTurnover,

          businessStructure:
            req.body.businessStructure,

          panNumber:
            req.body.panNumber,

          budget:
            req.body.budget,

          timeline:
            req.body.timeline,

          requirements:
            req.body.requirements,

          documents,

          source: "Website",
          region: "India"

        });

      res.status(201).json({
        success: true,
        enquiry
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        message: err.message
      });

    }

});

/* ===========================
      GET VENDOR ENQUIRIES
=========================== */

router.get("/vendor/:vendorId", async (req, res) => {
  try {

    const enquiries = await Enquiry.find({
      vendorId: req.params.vendorId,
    })
      .populate("userId", "name email phone")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      enquiries,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

/* ===========================
      GET USER ENQUIRIES
=========================== */

router.get("/user/:userId", async (req, res) => {
  try {

    const enquiries = await Enquiry.find({
      userId: req.params.userId,
    })
      .populate(
        "vendorId",
        "fullName photo designation firmName"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      enquiries,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

/* ===========================
      GET SINGLE ENQUIRY
=========================== */

router.get("/:id", async (req, res) => {
  try {

    const enquiry = await Enquiry.findById(
      req.params.id
    )
      .populate("vendorId")
      .populate("userId");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
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








router.put(
  "/:id/notes",
  async (req, res) => {
    try {

      const enquiry =
        await Enquiry.findByIdAndUpdate(
          req.params.id,
          {
            notes: req.body.notes
          },
          {
            new: true
          }
        );

      res.status(200).json({
        success: true,
        enquiry
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });

    }
  }
);










module.exports = router;