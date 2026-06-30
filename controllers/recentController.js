const User =
require("../models/User");

const Vendor =
require("../models/Vendor");

const Activity =
require("../models/Activity");


/* ==========================
   ADD RECENT VIEW
========================== */

exports.addRecentView =
async (req, res) => {

  try {

    const {
      vendorId
    } = req.body;

    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "User not found"

      });

    }

    // Remove existing view if already present

    user.recentViewed =
      user.recentViewed.filter(

        (item) =>

          item.vendor.toString() !==
          vendorId

      );

    // Add latest viewed profile

    user.recentViewed.unshift({

      vendor:
        vendorId,

      viewedAt:
        new Date()

    });

    // Keep latest 10 only

    user.recentViewed =
      user.recentViewed.slice(
        0,
        10
      );

    await user.save();

    // Create Activity

    const vendor =
      await Vendor.findById(
        vendorId
      );

    await Activity.create({

      userId:
        req.user.id,

      type:
        "viewed",

      title:
        "Profile Viewed",

      message:
        `You viewed ${
          vendor?.fullName ||
          "a CA"
        }'s profile.`

    });



  await Activity.create({
  vendorId,
  type: "profile_view",
  title: "Profile Viewed",
  message: `${user.fullName || user.name} viewed your profile`
});

    res.status(200).json({

      success: true,

      message:
        "Recent view added successfully"

    });

  }
  catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message:
        err.message

    });

  }

};


/* ==========================
   GET RECENT VIEWED
========================== */

exports.getRecentViewed =
async (req, res) => {

  try {

    console.log(
      "REQ.USER =>",
      req.user
    );

    const userId =

      req.user.id ||

      req.user.userId ||

      req.user._id;

    console.log(
      "USER ID =>",
      userId
    );

    const user =
      await User.findById(
        userId
      )
      .populate(
        "recentViewed.vendor"
      );

    console.log(
      "FOUND USER =>",
      user
    );

    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "User not found"

      });

    }

    res.status(200).json({

      success: true,

      recentViewed:
        user.recentViewed || []

    });

  }
  catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message:
        err.message

    });

  }

};