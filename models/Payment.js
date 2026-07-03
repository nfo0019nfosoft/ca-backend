const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
{
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  vendorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Vendor"
  },

  transactionId:{
    type:String,
    required:true,
    unique:true
  },

  orderId:{
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
    default:"Success"
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