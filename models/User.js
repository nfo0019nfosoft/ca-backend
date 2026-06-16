const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Login Details
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
        enum: ["user", "vendor", "admin"],
      default: "user",
    },

    profileImage: {
      type: String,
      default: "",
    },

    // Personal Info
    designation: String,

    // Business Info
    companyName: String,
    businessCategory: String,
    businessType: String,

    gstNumber: String,
    panNumber: String,

    businessEmail: String,
    website: String,

    officeContactNumber: String,

    // Address
    addressLine1: String,
    addressLine2: String,

    country: String,
    state: String,
    city: String,
    pincode: String,

    // Business Details
    industrySector: String,
    natureOfBusiness: String,
    registrationType: String,

    dateOfEstablishment: Date,

    gstStatus: String,
    gstRegistrationDate: Date,

    annualTurnover: String,
    teamSize: String,

    numberOfBranches: Number,

    accountingMethod: String,
    financialYear: String,

    tdsApplicable: String,

    businessDescription: String,

    preferredServices: [
      {
        type: String,
      },
    ],

    // Uploaded Documents
    documents: {
      panCard: String,
      gstCertificate: String,
      incorporationCertificate: String,
      aadhaarCard: String,
      bankStatement: String,
      itrDocument: String,
    },

    // Verification
    emailVerified: {
      type: Boolean,
      default: false,
    },

    mobileVerified: {
      type: Boolean,
      default: false,
    },

    gstVerified: {
      type: Boolean,
      default: false,
    },

    panVerified: {
      type: Boolean,
      default: false,
    },

    businessVerified: {
      type: Boolean,
      default: false,
    },

    bankVerified: {
      type: Boolean,
      default: false,
    },

    profileCompletion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);