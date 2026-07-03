const express =
require("express");

const router =
express.Router();

const {

seedPlans, 

getPlans,

getCurrentSubscription,

createOrUpgradeSubscription,

renewSubscription,

cancelSubscription

} =
require(
"../controllers/subscriptionController"
);



router.post("/seed",seedPlans);



router.get(
"/plans",
getPlans
);

router.get(
"/current/:vendorId",
getCurrentSubscription
);

router.post(
"/create",
createOrUpgradeSubscription
);

router.post(
"/renew",
renewSubscription
);

router.post(
"/cancel",
cancelSubscription
);

module.exports =
router;