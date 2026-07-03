const mongoose = require("mongoose");

const vendorSubscriptionSchema =
new mongoose.Schema(
{
  vendorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Vendor",
    required:true
  },

  planId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SubscriptionPlan",
    required:true
  },

  paymentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Payment",
    default:null
  },

  amount:{
    type:Number,
    required:true
  },

  billingCycle:{
    type:String,
    enum:[
      "Monthly",
      "Yearly"
    ],
    default:"Yearly"
  },

  startDate:{
    type:Date,
    default:Date.now
  },

  expiryDate:{
    type:Date,
    required:true
  },

  nextRenewalDate:{
    type:Date,
    required:true
  },

  autoRenew:{
    type:Boolean,
    default:false
  },

  status:{
    type:String,
    enum:[
      "Active",
      "Expired",
      "Cancelled"
    ],
    default:"Active"
  }

},
{
  timestamps:true
}
);

module.exports =
mongoose.model(
  "VendorSubscription",
  vendorSubscriptionSchema
);