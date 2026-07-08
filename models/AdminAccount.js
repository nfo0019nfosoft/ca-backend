const mongoose = require("mongoose");

const adminAccountSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    profilePhoto: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: [
        "superadmin",
        "admin",
        "manager",
        "sales",
        "support"
      ],
      default: "admin"
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive"
      ],
      default: "Active"
    },

    emailNotifications: {
      type: Boolean,
      default: true
    },

    loginAccess: {
      type: Boolean,
      default: true
    },

    twoFactorEnabled: {
      type: Boolean,
      default: false
    },

    mustChangePassword: {
      type: Boolean,
      default: true
    },

    lastLogin: {
      type: Date,
      default: null
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminAccount",
      default: null
    }

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "AdminAccount",
  adminAccountSchema
);