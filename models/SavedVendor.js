const mongoose = require("mongoose");

const savedVendorSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

savedVendorSchema.index(
  { userId: 1, vendorId: 1 },
  { unique: true }
);

module.exports = mongoose.model("SavedVendor", savedVendorSchema);