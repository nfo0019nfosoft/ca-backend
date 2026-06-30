const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
{
  // ======================
  // LOGIN DETAILS
  // ======================

  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  mobile: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "vendor"
  },

  profileType: {
    type: String,
    enum: ["individual", "firm"],
    default: "individual"
  },

  countryCode: {
    type: String,
    default: "+91"
  },

  officeCountryCode: {
    type: String,
    default: "+91"
  },

  // ======================
  // PROFILE
  // ======================

  photo: {
    type: String,
    default: ""
  },

  qualification: String,

  experience: {
    type: Number,
    default: 0
  },

  designation: String,

  about: String,

  businessType: String,

  // ======================
  // CA DETAILS
  // ======================

  caNumber: String,

  membershipNumber: String,

  contactNumber: String,

  // ======================
  // ADDRESS
  // ======================

  addressLine1: String,

  addressLine2: String,

  city: String,

  state: String,

  country: String,

  pincode: String,

  landmark: String,

  // ======================
  // FIRM DETAILS
  // ======================

  firmName: String,

  firmType: String,

  firmRegistrationNo: String,

  establishedOn: Date,

  gstNumber: String,

  panNumber: String,

  officeEmail: String,

  officeMobile: String,

  website: String,

  // ======================
  // KYC
  // ======================

  kyc: {

    panCard: String,

    aadhaarCard: String,

    photograph: String,

    addressProof: String,

    caCertificate: String

  },

  // ======================
  // SERVICES
  // ======================

  services: [

    {

      serviceName: {
        type: String,
        required: true
      },

      pricingModel: String,

      price: Number,

      deliveryTime: String,

      description: String

    }

  ],

  // ======================
  // BANK DETAILS
  // ======================

  bankDetails: {

    accountHolderName: String,

    bankName: String,

    accountNumber: String,

    ifscCode: String,

    branchName: String,

    accountType: {
      type: String,
      enum: ["Savings Account", "Current Account"]
    },

    upiId: String,

    preferredPayoutMethod: {
      type: String,
      default: "NEFT / IMPS"
    },

    payoutFrequency: {
      type: String,
      default: "Weekly"
    },

    minimumPayoutThreshold: {
      type: Number,
      default: 1000
    }

  },

  // ======================
  // AVAILABILITY
  // ======================

  available: {
    type: Boolean,
    default: true
  },

  workingDays: [String],

  workingHours: String,

  communicationModes: [String],

  // ======================
  // STATUS
  // ======================

  status: {
    type: String,
    enum: ["Active", "Pending", "Blocked"],
    default: "Pending"
  },





  profileViews: {
  type: Number,
  default: 0
},
  // ======================
  // VERIFICATION
  // ======================

  isVerified: {
    type: Boolean,
    default: false
  },

  profileCompletion: {
    type: Number,
    default: 0
  }

  

},
{
  timestamps: true
}

);

module.exports = mongoose.model(
  "Vendor",
  vendorSchema
);