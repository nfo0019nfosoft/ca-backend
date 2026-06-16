const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    // Login Details
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "vendor",
    },

    // Individual / Firm
    profileType: {
  type: String,
  enum: ["individual", "firm"],
  default: "individual",
},

countryCode: {
  type: String,
  default: "+91",
},

officeCountryCode: {
  type: String,
  default: "+91",
},
    // Profile
    photo: {
      type: String,
      default: "",
    },

    qualification: String,

    experience: {
      type: Number,
      default: 0,
    },

    designation: String,

    about: String,

    // Individual CA Details
    caNumber: String,

    membershipNumber: String,

    contactNumber: String,

    // Address
    addressLine1: String,

    addressLine2: String,

    city: String,

    state: String,

    country: String,

    pincode: String,

    landmark: String,

    // Firm Details
    firmName: String,

    firmType: String,

    firmRegistrationNo: String,

    establishedOn: Date,

    gstNumber: String,

    panNumber: String,

    officeEmail: String,

    officeMobile: String,

    website: String,

    // KYC Documents
    kyc: {
      panCard: String,

      aadhaarCard: String,

      addressProof: String,

      caCertificate: String,
    },

    // Services Offered
    services: [
      {
        serviceName: String,

        price: Number,

        deliveryTime: String,

        description: String,
      },
    ],

    // Bank Details
    bankDetails: {
      accountHolderName: String,

      bankName: String,

      accountNumber: String,

      ifscCode: String,

      upiId: String,
    },

    // Availability
    available: {
      type: Boolean,
      default: true,
    },

    workingDays: [String],

    workingHours: String,

    communicationModes: [String],

    // Verification
    isVerified: {
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

module.exports = mongoose.model(
  "Vendor",
  vendorSchema
);