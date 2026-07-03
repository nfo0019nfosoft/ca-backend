const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
{
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    default:null
  },

  vendorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Vendor",
    default:null
  },

  /* NEW */

  paymentFor:{
    type:String,
    enum:[
      "appointment",
      "subscription",
      "lead_purchase",
      "advertisement"
    ],
    required:true
  },

  appointmentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Consultation",
    default:null
  },

  subscriptionId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"VendorSubscription",
    default:null
  },

  planId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SubscriptionPlan",
    default:null
  },

  invoiceId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Invoice",
    default:null
  },

  transactionId:{
    type:String,
    required:true,
    unique:true
  },

  orderId:{
    type:String
  },

  razorpayPaymentId:{
    type:String
  },

  razorpayOrderId:{
    type:String
  },

  razorpaySignature:{
    type:String
  },

  description:{
    type:String,
    default:"CA Service Payment"
  },

  type:{
    type:String,
    enum:[
      "Payment",
      "Refund"
    ],
    default:"Payment"
  },

  amount:{
    type:Number,
    required:true
  },

  gstAmount:{
    type:Number,
    default:0
  },

  totalAmount:{
    type:Number,
    required:true
  },

  currency:{
    type:String,
    default:"INR"
  },

  paymentMethod:{
    type:String,
    enum:[
      "Razorpay",
      "Card",
      "UPI",
      "Net Banking",
      "Wallet"
    ],
    default:"Razorpay"
  },

  paymentProvider:{
    type:String,
    default:"Razorpay"
  },

  paymentDetails:{
    cardBrand:String,
    last4:String,
    holderName:String,
    expiryMonth:String,
    expiryYear:String,
    upiId:String,
    bankName:String
  },

  status:{
    type:String,
    enum:[
      "Success",
      "Pending",
      "Failed",
      "Refunded"
    ],
    default:"Pending"
  },

  invoiceUrl:{
    type:String,
    default:null
  }

},
{
  timestamps:true
});

module.exports =
mongoose.model(
  "Payment",
  paymentSchema
);