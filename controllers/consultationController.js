const Consultation = require("../models/Consultation");


// =====================================
// Book Consultation
// =====================================
exports.bookConsultation = async (req, res) => {
  try {

    const consultation =
      await Consultation.create({
        ...req.body,
        userId: req.user.id
      });

    res.status(201).json({
      success: true,
      consultation,
      message: "Consultation booked successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// =====================================
// Get User Consultations
// =====================================
exports.getUserConsultations =
async (req, res) => {
  try {

    const consultations =
      await Consultation.find({
        userId: req.params.userId
      })
      .populate(
        "vendorId",
        "fullName photo designation"
      )
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      consultations
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// =====================================
// Get Vendor Consultations
// =====================================
exports.getVendorConsultations =
async (req, res) => {
  try {

    const consultations =
      await Consultation.find({
        vendorId:
          req.params.vendorId
      })
      .populate(
        "userId",
        "name profileImage email phone"
      )
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      consultations
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// =====================================
// Update Consultation Status
// =====================================
exports.updateConsultationStatus =
async (req, res) => {
  try {

    const consultation =
      await Consultation.findByIdAndUpdate(
        req.params.id,
        {
          status:
            req.body.status
        },
        {
          new: true
        }
      );

    res.status(200).json({
      success: true,
      consultation,
      message:
        "Status updated successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};