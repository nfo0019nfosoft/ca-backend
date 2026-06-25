exports.addRecentView = async (req, res) => {
  try {
    const vendorId = req.body.vendorId;

    await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: {
          recentViewed: {
            vendor: vendorId,
          },
        },
      }
    );

    await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          recentViewed: {
            $each: [
              {
                vendor: vendorId,
                viewedAt: new Date(),
              },
            ],
            $position: 0,
          },
        },
      }
    );

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














const User = require("../models/User");

exports.getRecentViewed = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .populate("recentViewed.vendor");

    res.status(200).json(user.recentViewed);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};