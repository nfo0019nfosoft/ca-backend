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






  availability: [
{
  serviceId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Service"
  },

  days:[String],

  slots:[
    {
      startTime:String,
      endTime:String
    }
  ],

  duration:Number,

  fee:Number,

  bufferTime:Number,

  advanceBooking:Number
}
],













// ======================
// SETTINGS
// ======================

businessName: {
  type: String,
  default: ""
},

businessEmail: {
  type: String,
  default: ""
},

businessAddress: {
  type: String,
  default: ""
},

timeZone: {
  type: String,
  default: "Asia/Kolkata"
},

dateFormat: {
  type: String,
  default: "DD/MM/YYYY"
},

timeFormat: {
  type: String,
  default: "12 Hour"
},

emailNotifications: {

  newLead: {
    type: Boolean,
    default: true
  },

  appointmentBooked: {
    type: Boolean,
    default: true
  },

  appointmentReminder: {
    type: Boolean,
    default: true
  },

  paymentReceived: {
    type: Boolean,
    default: true
  },

  systemUpdates: {
    type: Boolean,
    default: true
  }

},

smsNotifications: {

  newLead: {
    type: Boolean,
    default: true
  },

  appointmentBooked: {
    type: Boolean,
    default: true
  },

  appointmentReminder: {
    type: Boolean,
    default: true
  },

  paymentReceived: {
    type: Boolean,
    default: false
  }

},

security: {

  twoFactorEnabled: {
    type: Boolean,
    default: false
  },

  loginAlerts: {
    type: Boolean,
    default: true
  }

},
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





currentPlan:{
  type:String,
  default:"free"
},

subscriptionStatus:{
  type:String,
  default:"inactive"
},

subscriptionId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"VendorSubscription",
  default:null
},




referralCode: {
  type: String,
  unique: true,
  default: () =>
    `BUS${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`
},

referralStats: {
  joined: {
    type: Number,
    default: 0
  },

  earned: {
    type: Number,
    default: 0
  },

  pending: {
    type: Number,
    default: 0
  }
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