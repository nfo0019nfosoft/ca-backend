const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    // User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Assigned Vendor
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
    },

    // Service Details
    serviceName: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    // Customer Details
    customerName: {
      type: String,
      required: true,
    },

    customerEmail: {
      type: String,
      required: true,
    },

    customerPhone: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      default: "",
    },

    annualTurnover: {
      type: String,
      default: "",
    },

    // Budget & Timeline
    budgetMin: {
      type: Number,
      default: 0,
    },

    budgetMax: {
      type: Number,
      default: 0,
    },

    timeline: {
      type: String,
      default: "",
    },

    preferredContactTime: {
      type: String,
      default: "",
    },

    requirements: {
      type: String,
      default: "",
    },

    // File Uploads
    attachments: [
      {
        type: String,
      },
    ],

    // Status
    status: {
      type: String,
      enum: [
        "new",
        "assigned",
        "in_progress",
        "converted",
        "closed",
        "cancelled",
      ],
      default: "new",
    },

    lastResponse: {
      type: String,
      default: "",
    },

    assignedAt: Date,

    closedAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);