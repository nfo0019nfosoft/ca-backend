const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
{
  // User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Vendor
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },

  // Service
  serviceName: {
    type: String,
    required: true,
  },

  subject: {
    type: String,
    default: "",
  },

  description: {
    type: String,
    default: "",
  },

  // Customer
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

  businessType: {
    type: String,
    default: "",
  },

  businessStructure: {
    type: String,
    default: "",
  },

  // Budget
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

  preferredContact: {
    type: String,
    default: "Call",
  },

  preferredContactTime: {
    type: String,
    default: "",
  },

  requirements: {
    type: String,
    default: "",
  },

  // Files
  attachments: [
    {
      type: String,
    },
  ],

  // Dashboard Status
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

  // Source
  leadSource: {
    type: String,
    default: "Website",
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

module.exports =
mongoose.model(
  "Lead",
  leadSchema
);