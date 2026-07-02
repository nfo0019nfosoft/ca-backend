const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ======================
    // LOGIN DETAILS
    // ======================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
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

    // ======================
    // PERSONAL INFORMATION
    // ======================

    designation: {
      type: String,
      default: "",
    },

    // ======================
    // BUSINESS INFORMATION
    // ======================

    companyName: {
      type: String,
      default: "",
    },

    businessCategory: {
      type: String,
      default: "",
    },

    businessType: {
      type: String,
      default: "",
    },

    gstNumber: {
      type: String,
      default: "",
    },

    panNumber: {
      type: String,
      default: "",
    },

    businessEmail: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    officeContactNumber: {
      type: String,
      default: "",
    },

    // ======================
    // ADDRESS
    // ======================

    addressLine1: {
      type: String,
      default: "",
    },

    addressLine2: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    // ======================
    // ADVANCED BUSINESS DETAILS
    // ======================

    industrySector: {
      type: String,
      default: "",
    },

    natureOfBusiness: {
      type: String,
      default: "",
    },

    registrationType: {
      type: String,
      default: "",
    },

    dateOfEstablishment: {
      type: Date,
    },

    gstStatus: {
      type: String,
      default: "",
    },

    gstRegistrationDate: {
      type: Date,
    },

    annualTurnover: {
      type: String,
      default: "",
    },

    teamSize: {
      type: String,
      default: "",
    },

    numberOfBranches: {
      type: Number,
      default: 0,
    },

    accountingMethod: {
      type: String,
      default: "",
    },

    financialYear: {
      type: String,
      default: "",
    },

    tdsApplicable: {
      type: String,
      default: "",
    },

    businessDescription: {
      type: String,
      default: "",
    },

    preferredServices: [
      {
        type: String,
      },
    ],

    // ======================
    // DOCUMENTS
    // ======================

    documents: {
      panCard: {
        type: String,
        default: "",
      },

      gstCertificate: {
        type: String,
        default: "",
      },

      incorporationCertificate: {
        type: String,
        default: "",
      },

      aadhaarCard: {
        type: String,
        default: "",
      },

      bankStatement: {
        type: String,
        default: "",
      },

      itrDocument: {
        type: String,
        default: "",
      },
    },

    // ======================
    // VERIFICATION
    // ======================

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

    // ======================
    // PROFILE COMPLETION
    // ======================

    profileCompletion: {
      type: Number,
      default: 0,
    },
personalCompleted: {
  type: Boolean,
  default: false,
},

businessCompleted: {
  type: Boolean,
  default: false,
},

documentsCompleted: {
  type: Boolean,
  default: false,
},

verificationCompleted: {
  type: Boolean,
  default: false,
},
    // ======================
    // NOTIFICATIONS
    // ======================

    notifications: [
      {
        title: String,

        message: String,

        isRead: {
          type: Boolean,
          default: false,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],






// ======================
// REFERRAL SYSTEM
// ======================

referralCode: {
  type: String,
  unique: true,
  default: () =>
    `BUS${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`
},

referredBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},

totalReferrals: {
  type: Number,
  default: 0
},

rewardsEarned: {
  type: Number,
  default: 0
},

pendingRewards: {
  type: Number,
  default: 0
},


recentViewed: [
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
],









    // ======================
    // ACCOUNT STATUS
    // ======================

    accountStatus: {
      type: String,
      enum: ["active", "pending", "suspended"],
      default: "active",
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);





module.exports = mongoose.model("User", userSchema);