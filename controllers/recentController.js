
const User = require("../models/User");

exports.addRecentView = async (req, res) => {
  try {
    const { vendorId } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Remove old entry if exists
    user.recentViewed = user.recentViewed.filter(
      (item) => item.vendor.toString() !== vendorId
    );

    // Add latest view
    user.recentViewed.unshift({
      vendor: vendorId,
      viewedAt: new Date(),
    });

    // Keep only latest 10
    user.recentViewed = user.recentViewed.slice(0, 10);

    await user.save();

    res.json({
      success: true,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};







exports.getRecentViewed = async (req, res) => {
  try {

    console.log("REQ.USER =>", req.user);

    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    console.log("USER ID =>", userId);

    const user = await User.findById(userId)
      .populate("recentViewed.vendor");

    console.log("FOUND USER =>", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json(user.recentViewed || []);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};






















