const SavedVendor = require("../models/SavedVendor");

/* ==========================
   SAVE VENDOR
========================== */

exports.saveVendor = async (req, res) => {
  try {

    const { vendorId } = req.body;
    const userId = req.user.id;

    const alreadySaved = await SavedVendor.findOne({
      userId,
      vendorId,
    });

    if (alreadySaved) {
      return res.status(200).json({
        success: true,
        message: "Vendor already saved",
      });
    }

    await SavedVendor.create({
      userId,
      vendorId,
    });

    return res.status(201).json({
      success: true,
      message: "Vendor saved successfully",
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};


/* ==========================
   GET SAVED VENDORS
========================== */
exports.getSavedVendors = async (req, res) => {
  try {

    console.log("Logged User:", req.user.id);

    const saved = await SavedVendor.find()
      .populate("vendorId");

    console.log(saved);

    res.json({
      success: true,
      savedCAs: saved.map(item => item.vendorId),
    });

  } catch (err) {
    console.log(err);
  }
};


/* ==========================
   REMOVE SAVED VENDOR
========================== */

exports.removeSavedVendor = async (req, res) => {
  try {

    await SavedVendor.findOneAndDelete({
      userId: req.user.id,
      vendorId: req.params.id,
    });

    return res.status(200).json({
      success: true,
      message: "Vendor removed successfully",
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};