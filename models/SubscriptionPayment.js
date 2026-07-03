const SubscriptionPaymentSchema = new mongoose.Schema({

vendorId:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"Vendor",
 required:true
},

planName:{
 type:String,
 required:true
},

billingType:{
 type:String,
 required:true
},

amount:{
 type:Number,
 required:true
},

razorpayPaymentId:String,
razorpayOrderId:String,

status:{
 type:String,
 default:"Success"
}

},{
 timestamps:true
});