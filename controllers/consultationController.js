const Consultation =
require("../models/Consultation");

const Notification =
require("../models/Notification");

const Vendor =
require("../models/Vendor");

const Activity =
require("../models/Activity");


// =====================================
// Book Consultation
// =====================================

exports.bookConsultation =
async (req, res) => {

  console.log(
    "BOOK CONSULTATION API HIT"
  );

  try {

    const consultation =
      await Consultation.create({

        ...req.body,

        userId:
          req.user.id

      });

    console.log(
      "CONSULTATION CREATED:",
      consultation._id
    );

    const vendor =
      await Vendor.findById(
        consultation.vendorId
      );

    console.log(
      "VENDOR FOUND:",
      vendor?.fullName
    );

    await Notification.create({

      userId:
        req.user.id,

      type:
        "appointment",

      title:
        "Appointment Confirmed",

      message:
        `Your appointment with ${
          vendor?.fullName ||
          "CA"
        } for ${
          consultation.serviceName
        } has been confirmed.`,

      relatedId:
        consultation._id

    });

    console.log(
      "NOTIFICATION CREATED"
    );

    await Activity.create({

      userId:
        req.user.id,

      type:
        "appointment",

      title:
        "Consultation Booked",

      message:
        `You booked a consultation with ${
          vendor?.fullName ||
          "CA"
        } for ${
          consultation.serviceName
        }.`

    });

    console.log(
      "ACTIVITY CREATED"
    );


await Notification.create({
  vendorId,
  type: "appointment",
  title: "New Appointment",
  message: `Appointment booked for ${serviceName}`
});


await Activity.create({
  vendorId,
  type: "appointment",
  title: "Appointment Scheduled",
  message: `${serviceName} consultation booked`
});



await Notification.create({
  vendorId: consultation.vendorId,
  type: "appointment",
  title: "New Appointment",
  message: `New appointment booked for ${consultation.serviceName}`,
  relatedId: consultation._id
});

await Activity.create({
  vendorId:consultation.vendorId,
  type:"appointment",
  title:"Appointment Scheduled",
  message:`Appointment booked for ${consultation.serviceName}`
});
    res.status(201).json({

      success: true,

      consultation,

      message:
        "Consultation booked successfully"

    });

  }
  catch (error) {

    console.log(
      "BOOK CONSULTATION ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        error.message

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

        userId:
          req.params.userId

      })

      .populate(
        "vendorId",
        "fullName photo designation qualification"
      )

      .sort({
        createdAt: -1
      });

    res.status(200).json({

      success: true,

      consultations

    });

  }
  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message

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

  }
  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message

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

    if (!consultation) {

      return res.status(404).json({

        success: false,

        message:
          "Consultation not found"

      });

    }

    await Notification.create({

      userId:
        consultation.userId,

      type:
        "appointment",

      title:
        "Appointment Updated",

      message:
        `Your appointment status has been updated to ${
          req.body.status
        }.`,

      relatedId:
        consultation._id

    });





    await Activity.create({

  userId:
    consultation.userId,

  type:
    "appointment",

  title:
    "Appointment Updated",

  message:
    `Your appointment status changed to ${
      req.body.status
    }.`

});







    res.status(200).json({

      success: true,

      consultation,

      message:
        "Status updated successfully"

    });

  }
  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// =====================================
// Get Single Consultation
// =====================================

exports.getSingleConsultation =
async (req, res) => {

  try {

    const consultation =
      await Consultation.findById(
        req.params.id
      )

      .populate(
        "vendorId",
        "fullName photo designation"
      )

      .populate(
        "userId",
        "name profileImage email"
      );

    if (!consultation) {

      return res.status(404).json({

        success: false,

        message:
          "Consultation not found"

      });

    }

    res.status(200).json({

      success: true,

      consultation

    });

  }
  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// =====================================
// Delete Consultation
// =====================================

exports.deleteConsultation =
async (req, res) => {

  try {

    const consultation =
      await Consultation.findByIdAndDelete(
        req.params.id
      );

    if (!consultation) {

      return res.status(404).json({

        success: false,

        message:
          "Consultation not found"

      });

    }

    res.status(200).json({

      success: true,

      message:
        "Consultation deleted successfully"

    });

  }
  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};