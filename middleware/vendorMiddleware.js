exports.getProfile = async (
  req,
  res
) => {
  try {

    console.log(
      "GET PROFILE HIT"
    );

    console.log(
      "USER ID =>",
      req.user.id
    );

    const vendor =
      await Vendor.findById(
        req.user.id
      ).select("-password");

    console.log(
      "VENDOR =>",
      vendor
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      vendor,
    });

  } catch (error) {

    console.log(
      "PROFILE ERROR =>",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};