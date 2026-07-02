const Vendor =
require("../models/Vendor");

const bcrypt =
require("bcryptjs");

// ====================================
// GET SETTINGS
// ====================================

exports.getVendorSettings =
async(req,res)=>{

try{

const vendor =
await Vendor.findById(
req.user.id
).select("-password");

if(!vendor){

return res.status(404)
.json({
success:false,
message:
"Vendor not found"
});

}

res.status(200)
.json({
success:true,
vendor
});

}catch(err){

console.log(err);

res.status(500)
.json({
success:false,
message:
"Server Error"
});

}

};

// ====================================
// UPDATE SETTINGS
// ====================================

exports.updateVendorSettings =
async(req,res)=>{

try{

const {
businessName,
businessEmail,
phone,
businessAddress,
city,
state,
pinCode,
timeZone,
dateFormat,
timeFormat,
emailNotifications,
smsNotifications,
security
}
=
req.body;

const vendor =
await Vendor.findById(
req.user.id
);

if(!vendor){

return res.status(404)
.json({
success:false,
message:
"Vendor not found"
});

}

/* ==========================
   BUSINESS DETAILS
========================== */

vendor.businessName =
businessName;

vendor.businessEmail =
businessEmail;

vendor.businessAddress =
businessAddress;

/* ==========================
   SYNC WITH PROFILE
========================== */

vendor.firmName =
businessName;

vendor.officeEmail =
businessEmail;

vendor.officeMobile =
phone;

vendor.city =
city;

vendor.state =
state;

vendor.pincode =
pinCode;

/* ==========================
   SETTINGS
========================== */

vendor.timeZone =
timeZone;

vendor.dateFormat =
dateFormat;

vendor.timeFormat =
timeFormat;

vendor.emailNotifications =
emailNotifications;

vendor.smsNotifications =
smsNotifications;

vendor.security =
security;

/* ==========================
   SAVE
========================== */

await vendor.save();

res.status(200)
.json({
success:true,
message:
"Settings Updated Successfully",
vendor
});

}catch(err){

console.log(err);

res.status(500)
.json({
success:false,
message:
"Server Error"
});

}

};

// ====================================
// CHANGE PASSWORD
// ====================================

exports.changeVendorPassword =
async(req,res)=>{

try{

const {
currentPassword,
newPassword,
confirmPassword
}
=
req.body;

const vendor =
await Vendor.findById(
req.user.id
);

if(!vendor){

return res.status(404)
.json({
success:false,
message:
"Vendor not found"
});

}

const isMatch =
await bcrypt.compare(
currentPassword,
vendor.password
);

if(!isMatch){

return res.status(400)
.json({
success:false,
message:
"Current Password Incorrect"
});

}

if(
newPassword !==
confirmPassword
){

return res.status(400)
.json({
success:false,
message:
"Passwords do not match"
});

}

const salt =
await bcrypt.genSalt(10);

vendor.password =
await bcrypt.hash(
newPassword,
salt
);

await vendor.save();

res.status(200)
.json({
success:true,
message:
"Password Changed Successfully"
});

}catch(err){

console.log(err);

res.status(500)
.json({
success:false,
message:
"Server Error"
});

}

};