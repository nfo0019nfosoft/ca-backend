const SavedVendor =
require("../models/SavedVendor");

const Vendor =
require("../models/Vendor");

const Activity =
require("../models/Activity");

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
const vendor =
  await Vendor.findById(
    vendorId
  );

await Activity.create({

  userId,

  type:
    "saved",

  title:
    "CA Saved",

  message:
    `You saved ${
      vendor?.fullName ||
      "a CA"
    } to your favourites.`

});


await Activity.create({
  vendorId,
  type: "saved",
  title: "Profile Saved",
  message: `${user.fullName || user.name} saved your profile`
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

    console.log("REQ USER =>", req.user);

    console.log(
      "FETCHING FOR USER ID =>",
      req.user.id
    );

    const saved =
      await SavedVendor.find({
        userId: req.user.id
      }).populate("vendorId");

    console.log(
      "RESULT =>",
      saved
    );

    res.json({
      success: true,
      savedCAs: saved.map(
        item => item.vendorId
      ),
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