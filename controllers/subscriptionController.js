const SubscriptionPlan =
require("../models/SubscriptionPlan");

const VendorSubscription =
require("../models/VendorSubscription");

const Vendor =
require("../models/Vendor");

const Payment =
require("../models/Payment");

const SubscriptionInvoice =
require("../models/SubscriptionInvoice");







/* ==========================
SEED DEFAULT PLANS
========================== */

exports.seedPlans =
async(req,res)=>{
console.log("SEED API HIT");
try{

const existingPlans =
await SubscriptionPlan.countDocuments();

if(existingPlans > 0){

return res.status(400).json({
success:false,
message:
"Plans already exist"
});

}

await SubscriptionPlan.insertMany([

{
name:"Starter",
slug:"starter",
level:1,
price:0,
billingCycle:"Yearly",

description:
"Get started and build your online presence.",

features:[
"Business Profile",
"Basic Search Visibility",
"Reviews & Ratings",
"Contact with Business"
],

maxLeads:10,
maxDocuments:5,
maxTeamMembers:1,
storage:1,

priority:4,

featuredListing:false,
appointmentBooking:false,
dashboardAnalytics:false,

searchRanking:"Basic",
supportLevel:"Standard",

active:true
},

{
name:"Growth",
slug:"growth",
level:2,
price:7999,
billingCycle:"Yearly",

description:
"Increase visibility and start getting appointments.",

features:[
"Higher Visibility",
"Appointment Booking",
"Featured in Search",
"Priority Support"
],

maxLeads:100,
maxDocuments:25,
maxTeamMembers:3,
storage:10,

priority:3,

featuredListing:true,
appointmentBooking:true,
dashboardAnalytics:true,

searchRanking:"Priority",
supportLevel:"Priority",

active:true
},

{
name:"Professional",
slug:"professional",
level:3,
price:13999,
billingCycle:"Yearly",

description:
"Boost credibility and get more business.",

features:[
"Higher Search Ranking",
"More Appointments",
"Premium Badge",
"Limited Homepage Recommendation",
"Priority Support"
],

maxLeads:500,
maxDocuments:100,
maxTeamMembers:10,
storage:50,

priority:2,

featuredListing:true,
appointmentBooking:true,
dashboardAnalytics:true,

searchRanking:"High",
supportLevel:"Priority",

active:true
},

{
name:"Elite",
slug:"elite",
level:4,
price:23999,
billingCycle:"Yearly",

description:
"Maximum visibility and premium support.",

features:[
"Top Search Placement",
"Unlimited Appointments",
"Premium Badge",
"Priority Homepage Recommendation",
"Dedicated Support"
],

maxLeads:-1,
maxDocuments:-1,
maxTeamMembers:-1,
storage:200,

priority:1,

featuredListing:true,
appointmentBooking:true,
dashboardAnalytics:true,

searchRanking:"Highest",
supportLevel:"Dedicated",

active:true
}

]);

res.status(201).json({
success:true,
message:
"Subscription plans created successfully"
});

}catch(error){

console.log(error);

res.status(500).json({
success:false,
message:error.message
});

}

};


/* ==========================
GET ALL PLANS
========================== */

exports.getPlans =
async(req,res)=>{

try{

const plans =
await SubscriptionPlan.find({
active:true
}).sort({
level:1
});

res.status(200).json({
success:true,
plans
});

}catch(error){

console.log(error);

res.status(500).json({
success:false,
message:"Failed to fetch plans"
});

}

};

/* ==========================
GET CURRENT SUBSCRIPTION
========================== */

exports.getCurrentSubscription =
async(req,res)=>{

try{

const {vendorId} =
req.params;

const subscription =
await VendorSubscription
.findOne({
vendorId,
status:"Active"
})
.populate("planId")
.populate("paymentId");

res.status(200).json({
success:true,
subscription
});

}catch(error){

console.log(error);

res.status(500).json({
success:false,
message:"Failed to fetch subscription"
});

}

};

/* ==========================
CREATE OR UPGRADE
========================== */

exports.createOrUpgradeSubscription =
async(req,res)=>{

try{

const {
vendorId,
planId,
paymentId
} = req.body;

const vendor =
await Vendor.findById(
vendorId
);

if(!vendor){
return res.status(404).json({
success:false,
message:"Vendor not found"
});
}

const selectedPlan =
await SubscriptionPlan.findById(
planId
);

if(!selectedPlan){
return res.status(404).json({
success:false,
message:"Plan not found"
});
}

const currentSubscription =
await VendorSubscription.findOne({
vendorId,
status:"Active"
}).populate("planId");

if(currentSubscription){

const currentLevel =
currentSubscription.planId.level;

const newLevel =
selectedPlan.level;

if(newLevel < currentLevel){

return res.status(400).json({
success:false,
message:
"Downgrade is not allowed."
});

}

if(newLevel === currentLevel){

return res.status(400).json({
success:false,
message:
`You already have ${selectedPlan.name} plan.`
});

}

currentSubscription.status =
"Expired";

await currentSubscription.save();
}

const startDate =
new Date();

const expiryDate =
new Date();

expiryDate.setMonth(
expiryDate.getMonth()+1
);

const subscription =
await VendorSubscription.create({

vendorId,

planId:selectedPlan._id,

amount:selectedPlan.price,

billingCycle:
selectedPlan.billingCycle,

paymentId,

startDate,

expiryDate,

nextRenewalDate:
expiryDate,

status:"Active"

});

vendor.currentPlan =
selectedPlan.slug;

vendor.subscriptionId =
subscription._id;

vendor.subscriptionStatus =
"Active";

await vendor.save();

/* CREATE INVOICE */

const invoiceNumber =
`SUB-${Date.now()}`;

await SubscriptionInvoice.create({

vendorId,

subscriptionId:
subscription._id,

paymentId,

invoiceNumber,

planName:
selectedPlan.name,

amount:
selectedPlan.price,

gst:
selectedPlan.price * 0.18,

totalAmount:
selectedPlan.price +
(selectedPlan.price * 0.18),

billingCycle:
selectedPlan.billingCycle,

status:"Paid"

});

return res.status(201).json({

success:true,

message:
`${selectedPlan.name} plan activated successfully.`,

subscription

});

}catch(error){

console.log(error);

return res.status(500).json({
success:false,
message:"Server Error"
});

}

};

/* ==========================
RENEW PLAN
========================== */

exports.renewSubscription =
async(req,res)=>{

try{

const {
vendorId,
paymentId
} = req.body;

const subscription =
await VendorSubscription.findOne({
vendorId,
status:"Active"
}).populate("planId");

if(!subscription){

return res.status(404).json({
success:false,
message:"No active subscription found"
});

}

const expiryDate =
new Date(
subscription.expiryDate
);

expiryDate.setMonth(
expiryDate.getMonth()+1
);

subscription.expiryDate =
expiryDate;

subscription.nextRenewalDate =
expiryDate;

subscription.paymentId =
paymentId;

await subscription.save();

return res.status(200).json({

success:true,
message:
"Subscription renewed successfully",
subscription

});

}catch(error){

console.log(error);

res.status(500).json({
success:false,
message:"Renewal failed"
});

}

};

/* ==========================
CANCEL SUBSCRIPTION
========================== */

exports.cancelSubscription =
async(req,res)=>{

try{

const {vendorId} =
req.body;

const subscription =
await VendorSubscription.findOne({
vendorId,
status:"Active"
});

if(!subscription){

return res.status(404).json({
success:false,
message:"Subscription not found"
});

}

subscription.status =
"Cancelled";

await subscription.save();

await Vendor.findByIdAndUpdate(
vendorId,
{
subscriptionStatus:
"Cancelled"
}
);

res.status(200).json({
success:true,
message:
"Subscription cancelled successfully"
});

}catch(error){

console.log(error);

res.status(500).json({
success:false,
message:"Cancellation failed"
});

}

};