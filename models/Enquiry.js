const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    serviceName: [String],

    fullName: String,
    email: String,
    mobile: String,

    preferredContact: String,
    preferredTime: String,

    businessType: String,
    annualTurnover: String,
    businessStructure: String,
    panNumber: String,

    requirements: String,

    status: {
      type: String,
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Enquiry",
  enquirySchema
);