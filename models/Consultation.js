const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    // Relations
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },

    // Service
    serviceName: {
      type: String,
      required: true,
    },

    // Appointment
    appointmentDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      default: "",
    },

    endTime: {
      type: String,
      default: "",
    },

    // Meeting Mode
    mode: {
      type: String,
      enum: ["video", "phone", "in_person"],
      default: "video",
    },

    meetingLink: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    // Payment
    amount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },

    // Appointment Status
    status: {
      type: String,
      enum: [
        "upcoming",
        "completed",
        "cancelled",
        "rescheduled",
        "no_show",
      ],
      default: "upcoming",
    },

    completedAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Consultation",
  consultationSchema
);