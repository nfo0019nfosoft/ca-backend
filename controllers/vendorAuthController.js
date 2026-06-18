const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================
// REGISTER VENDOR
// =========================
exports.registerVendor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      password,
    } = req.body;

    const existingVendor =
      await Vendor.findOne({
        $or: [
          { mobile },
          { email },
        ],
      });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const vendor =
      await Vendor.create({
        fullName,
        email,
        mobile,
        password: hashedPassword,
      });

    const vendorData =
      vendor.toObject();

    delete vendorData.password;

    return res.status(201).json({
      success: true,
      message:
        "Vendor registered successfully",
      vendor: vendorData,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =========================
// LOGIN VENDOR
// =========================
// =========================
// LOGIN VENDOR
// =========================
exports.loginVendor = async (req, res) => {
  try {

    const { mobile } = req.body;

    let vendor = await Vendor.findOne({
      mobile,
    });

    // Vendor lekapothe create cheyyi
    if (!vendor) {

      vendor = await Vendor.create({
        fullName: "Vendor",
        mobile,
        email: `${mobile}@vendor.com`,
        password: "temp123",
        role: "vendor",
      });

    }

    const token = jwt.sign(
      {
        id: vendor._id,
        role: "vendor",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const vendorData = vendor.toObject();
    delete vendorData.password;

    return res.status(200).json({
      success: true,
      token,
      user: vendorData,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =========================
// GET PROFILE
// =========================
exports.getProfile = async (req, res) => {
  try {

    console.log("GET PROFILE HIT");

    console.log("REQ.USER =", req.user);

    const vendor = await Vendor.findById(
      req.user.id
    ).select("-password");

    console.log("VENDOR =>", vendor);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      vendor,
    });

  } catch (error) {

    console.log(
      "PROFILE ERROR =>",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =========================
// UPDATE PROFILE
// =========================
exports.updateProfile = async (
  req,
  res
) => {
  try {

    const vendor =
      await Vendor.findByIdAndUpdate(
        req.user.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    return res.status(200).json({
      success: true,
      vendor,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =========================
// UPDATE SERVICES
// =========================
exports.updateServices = async (
  req,
  res
) => {
  try {

    const vendor =
      await Vendor.findByIdAndUpdate(
        req.user.id,
        {
          services:
            req.body.services,
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message:
          "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Services updated successfully",
      vendor,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =========================
// SAVE KYC
// =========================
exports.saveKyc = async (req, res) => {
  try {

    console.log("REQ USER =>", req.user);
    console.log("REQ USER ID =>", req.user?.id);
    console.log("FILES =>", req.files);

    const vendor = await Vendor.findById(
      req.user.id
    );

    console.log("FOUND VENDOR =>", vendor);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    vendor.kyc = {
      panCard:
        req.files?.panCard?.[0]?.filename ||
        vendor.kyc?.panCard ||
        "",

      aadhaarCard:
        req.files?.aadhaarCard?.[0]?.filename ||
        vendor.kyc?.aadhaarCard ||
        "",

      photograph:
        req.files?.photograph?.[0]?.filename ||
        vendor.kyc?.photograph ||
        "",

      addressProof:
        req.files?.addressProof?.[0]?.filename ||
        vendor.kyc?.addressProof ||
        "",

      caCertificate:
        req.files?.caCertificate?.[0]?.filename ||
        vendor.kyc?.caCertificate ||
        "",
    };

    await vendor.save();

    console.log("KYC SAVED SUCCESSFULLY");

    return res.status(200).json({
      success: true,
      message: "KYC saved successfully",
      vendor,
    });

  } catch (error) {

    console.log("KYC ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// =========================
// SAVE PHOTO
// =========================
exports.savePhoto = async (
  req,
  res
) => {
  try {

    console.log(
      "USER =>",
      req.user
    );

    console.log(
      "FILE =>",
      req.file
    );

    const vendor =
      await Vendor.findByIdAndUpdate(
        req.user.id,
        {
          photo:
            req.file.filename,
        },
        {
          new: true,
        }
      );

    console.log(
      "UPDATED =>",
      vendor
    );

    return res.status(200).json({
      success: true,
      vendor,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};










// =========================
// GET ALL VENDORS
// =========================
exports.getAllVendors = async (
  req,
  res
) => {
  try {

    const vendors =
      await Vendor.find()
      .select("-password");

    return res.status(200).json(
      vendors
    );

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

















// =========================
// GET SINGLE VENDOR
// =========================

exports.getVendorById = async (
  req,
  res
) => {
  try {

    const vendor =
      await Vendor.findById(
        req.params.id
      ).select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      vendor,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};