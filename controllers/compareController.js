const Compare = require("../models/Compare");

exports.addToCompare = async (req, res) => {
  try {
    const { vendorId } = req.body;

    const exists = await Compare.findOne({
      user: req.user.id,
      vendor: vendorId,
    });

    if (exists) {
      return res.json({
        message: "Already added",
      });
    }

    const total = await Compare.countDocuments({
      user: req.user.id,
    });

    if (total >= 4) {
      return res.status(400).json({
        message: "Maximum 4 CAs can be compared",
      });
    }

    await Compare.create({
      user: req.user.id,
      vendor: vendorId,
    });

    res.json({
      message: "Added to compare",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getCompare = async (req, res) => {
  try {
    const compare = await Compare.find({
      user: req.user.id,
    }).populate("vendor");

    res.json(compare);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.removeCompare = async (req, res) => {
  try {

    await Compare.findOneAndDelete({
      user: req.user.id,
      vendor: req.params.vendorId,
    });

    res.json({
      message: "Removed",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};