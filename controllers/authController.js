const User = require("../models/User");
const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   REGISTER USER
========================= */
exports.register = async (req, res) => {
  try {

    const {
      name,
      email,
      phone,
      password
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({
        name,
        email,
        phone,
        password: hashedPassword
      });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    return res.status(201).json({
      success: true,
      token,
      user
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

/* =========================
   LOGIN USER / VENDOR
========================= */

exports.login = async (req, res) => {
  try {

    const { phone, role } = req.body;

    let account;

    if (role === "vendor") {

      account = await Vendor.findOne({
        mobile: phone
      });

      if (!account) {

        account = await Vendor.create({
          fullName: "Vendor",
          email: `${phone}@vendor.com`,
          mobile: phone,
          password: "temp123",
          role: "vendor"
        });

      }

    } else {

      account = await User.findOne({
        phone
      });

      if (!account) {

        account = await User.create({
          name: "User",
          email: `${phone}@caconnect.com`,
          phone,
          password: "temp123",
          role: "user"
        });

      }
    }

    const token = jwt.sign(
      {
        id: account._id,
        role: role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: account
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

/* =========================
   PROFILE
========================= */
exports.getProfile = async (
  req,
  res
) => {
  try {

    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* =========================
   UPDATE PROFILE
========================= */
exports.updateProfile = async (req, res) => {
  try {

    console.log("Incoming Data:");
    console.log(req.body);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    console.log("Updated User:");
    console.log(user);

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};














exports.getReferralStats =
async(req,res)=>{

try{

const user =
await User.findById(
req.user.id
);

res.status(200).json({
success:true,
referralCode:
user.referralCode,
peopleJoined:
user.totalReferrals,
rewardsEarned:
user.rewardsEarned,
pendingRewards:
user.pendingRewards
});

}
catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};

















exports.updateEmailPreferences =
async(req,res)=>{

try{

const {key,value} =
req.body;

const user =
await User.findById(
req.user.id
);

user.emailPreferences[key] =
value;

await user.save();

res.json({
success:true
});

}
catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};


















exports.updateNotificationPreferences =
async(req,res)=>{

try{

const {key,value} =
req.body;

const user =
await User.findById(
req.user.id
);

user.notificationPreferences[key] =
value;

await user.save();

res.json({
success:true
});

}
catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};











exports.changePassword =
async(req,res)=>{

try{

const {
currentPassword,
newPassword
} = req.body;

const user =
await User.findById(
req.user.id
);

if(!user){
return res.status(404).json({
success:false,
message:"User not found"
});
}

const isMatch =
await bcrypt.compare(
currentPassword,
user.password
);

if(!isMatch){
return res.status(400).json({
success:false,
message:"Current password is incorrect"
});
}

const hashedPassword =
await bcrypt.hash(
newPassword,
10
);

user.password =
hashedPassword;

user.passwordSettings = {
lastChanged:new Date()
};

await user.save();

res.status(200).json({
success:true,
message:"Password updated successfully"
});

}
catch(error){

console.log(error);

res.status(500).json({
success:false,
message:"Server Error"
});

}

};



















exports.updatePrivacySettings =
async(req,res)=>{

try{

const {
profileVisibility,
dataSharing,
activityTracking,
marketingCommunications
} = req.body;

const user =
await User.findByIdAndUpdate(
req.user.id,
{
privacySettings:{
profileVisibility,
dataSharing,
activityTracking,
marketingCommunications
}
},
{
new:true
}
);

res.status(200).json({
success:true,
message:"Privacy settings updated",
privacySettings:
user.privacySettings
});

}
catch(error){

console.log(error);

res.status(500).json({
success:false,
message:"Server Error"
});

}

};
















exports.deleteAccount =
async(req,res)=>{

try{

await User.findByIdAndUpdate(
req.user.id,
{
isDeleted:true,
deletedAt:new Date()
}
);

res.status(200).json({
success:true,
message:"Account deleted successfully"
});

}
catch(error){

console.log(error);

res.status(500).json({
success:false,
message:"Server Error"
});

}

};

















exports.downloadUserData =
async(req,res)=>{

try{

const user =
await User.findById(
req.user.id
)
.select("-password");

if(!user){
return res.status(404).json({
success:false,
message:"User not found"
});
}

res.status(200).json({
success:true,
data:user
});

}
catch(error){

console.log(error);

res.status(500).json({
success:false,
message:"Server Error"
});

}

};