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
      { email }
    ]
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
exports.loginVendor = async (
req,
res
) => {
try {


const {
  mobile,
  password,
} = req.body;

const vendor =
  await Vendor.findOne({
    mobile,
  });

console.log(
  "LOGIN VENDOR =>",
  vendor
);

if (!vendor) {
  return res.status(404).json({
    success: false,
    message:
      "Vendor not found",
  });
}

const isMatch =
  await bcrypt.compare(
    password,
    vendor.password
  );

if (!isMatch) {
  return res.status(400).json({
    success: false,
    message:
      "Invalid password",
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

const vendorData =
  vendor.toObject();

delete vendorData.password;

return res.status(200).json({
  success: true,
  token,
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
// GET PROFILE
// =========================
exports.getProfile = async (
req,
res
) => {
try {

console.log(
  "GET PROFILE HIT"
);

console.log(
  "USER =>",
  req.user
);

const vendor =
  await Vendor.findById(
    req.user.id
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
exports.updateProfile =
async (req, res) => {
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
      "Profile updated successfully",
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
exports.updateServices =
async (req, res) => {
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