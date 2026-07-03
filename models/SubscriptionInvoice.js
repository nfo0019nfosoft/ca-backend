const mongoose =
require("mongoose");

const subscriptionInvoiceSchema =
new mongoose.Schema(
{
  vendorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Vendor",
    required:true
  },

  subscriptionId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"VendorSubscription",
    required:true
  },

  paymentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Payment",
    required:true
  },

  invoiceNumber:{
    type:String,
    required:true,
    unique:true
  },

  planName:{
    type:String,
    required:true
  },

  amount:{
    type:Number,
    required:true
  },

  gst:{
    type:Number,
    default:0
  },

  totalAmount:{
    type:Number,
    required:true
  },

  billingCycle:{
    type:String,
    default:"Monthly"
  },

  status:{
    type:String,
    enum:[
      "Paid",
      "Pending",
      "Failed",
      "Refunded"
    ],
    default:"Paid"
  },

  invoicePdf:{
    type:String,
    default:null
  }

},
{
  timestamps:true
}
);

module.exports =
mongoose.model(
  "SubscriptionInvoice",
  subscriptionInvoiceSchema
);