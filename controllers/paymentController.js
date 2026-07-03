const Razorpay = require("razorpay");
const crypto = require("crypto");

const Notification =
require("../models/Notification");

const Activity =
require("../models/Activity");

const Payment =
require("../models/Payment");

const razorpay =
new Razorpay({
  key_id:
    process.env.RAZORPAY_KEY_ID,

  key_secret:
    process.env.RAZORPAY_SECRET
});


/* ==================================
   CREATE ORDER
================================== */

exports.createOrder =
async(req,res)=>{

try{

const amount =
Number(req.body.amount);

if(!amount){

return res.status(400).json({
success:false,
message:"Amount is required"
});

}

const options = {

amount:
amount * 100,

currency:
"INR",

receipt:
`receipt_${Date.now()}`

};

const order =
await razorpay.orders.create(
options
);

res.status(200).json({
success:true,
order
});

}
catch(error){

console.log(error);

res.status(500).json({
success:false,
message:error.message
});

}

};



/* ==================================
   VERIFY PAYMENT
================================== */

exports.verifyPayment =
async(req,res)=>{

try{

const {

razorpay_order_id,
razorpay_payment_id,
razorpay_signature,

userId,
vendorId,
amount,

paymentMethod,
paymentDetails

} = req.body;

const generatedSignature =
crypto
.createHmac(
"sha256",
process.env.RAZORPAY_SECRET
)
.update(
`${razorpay_order_id}|${razorpay_payment_id}`
)
.digest("hex");

if(
generatedSignature !==
razorpay_signature
){

return res.status(400).json({
success:false,
message:
"Invalid payment signature"
});

}


/* SAVE PAYMENT */

const payment =
await Payment.create({

userId,

vendorId,

transactionId:
razorpay_payment_id,

orderId:
razorpay_order_id,

description:
"CA Service Payment",

type:
"Payment",

amount,

paymentMethod:
paymentMethod ||
"Razorpay",

paymentProvider:
"Razorpay",

paymentDetails:
paymentDetails || {},

status:
"Success",

invoiceUrl:
null

});


/* USER NOTIFICATION */

await Notification.create({

userId,

type:
"payment",

title:
"Payment Successful",

message:
`Payment of ₹${amount} completed successfully.`

});


/* USER ACTIVITY */

await Activity.create({

userId,

type:
"payment",

title:
"Payment Successful",

message:
`You completed a payment of ₹${amount}.`

});


/* VENDOR ACTIVITY */

if(vendorId){

await Activity.create({

vendorId,

type:
"payment",

title:
"Payment Received",

message:
`Payment of ₹${amount} received`

});

await Notification.create({

vendorId,

type:
"payment",

title:
"Payment Received",

message:
`₹${amount} payment received`

});

}

res.status(200).json({

success:true,

message:
"Payment verified successfully",

payment

});

}
catch(error){

console.log(error);

res.status(500).json({

success:false,

message:
error.message

});

}

};



/* ==================================
   GET USER PAYMENTS
================================== */

exports.getUserPayments =
async(req,res)=>{

try{

const payments =
await Payment.find({

userId:
req.params.userId

})
.sort({
createdAt:-1
});

res.status(200).json({

success:true,

payments

});

}
catch(error){

console.log(error);

res.status(500).json({

success:false,

message:
error.message

});

}

};



/* ==================================
   REFUND PAYMENT
================================== */

exports.refundPayment =
async(req,res)=>{

try{

const {
paymentId
}
=
req.body;

const payment =
await Payment.findById(
paymentId
);

if(!payment){

return res.status(404).json({
success:false,
message:
"Payment not found"
});

}

payment.status =
"Refunded";

await payment.save();


await Payment.create({

userId:
payment.userId,

vendorId:
payment.vendorId,

transactionId:
`refund_${Date.now()}`,

orderId:
payment.orderId,

description:
"Payment Refund",

type:
"Refund",

amount:
payment.amount,

paymentMethod:
payment.paymentMethod,

paymentProvider:
payment.paymentProvider,

paymentDetails:
payment.paymentDetails,

status:
"Refunded",

invoiceUrl:
null

});


await Notification.create({

userId:
payment.userId,

type:
"refund",

title:
"Refund Processed",

message:
`Refund of ₹${payment.amount} processed successfully.`

});


await Activity.create({

userId:
payment.userId,

type:
"refund",

title:
"Refund Processed",

message:
`Refund of ₹${payment.amount} has been completed.`

});


res.status(200).json({

success:true,

message:
"Refund completed successfully"

});

}
catch(error){

console.log(error);

res.status(500).json({

success:false,

message:
error.message

});

}

};



/* ==================================
   DOWNLOAD INVOICE
================================== */

exports.downloadInvoice =
async(req,res)=>{

try{

const payment =
await Payment.findById(
req.params.paymentId
);

if(!payment){

return res.status(404).json({
success:false,
message:
"Payment not found"
});

}

if(!payment.invoiceUrl){

return res.status(404).json({
success:false,
message:
"Invoice not generated yet"
});

}

res.redirect(
payment.invoiceUrl
);

}
catch(error){

console.log(error);

res.status(500).json({

success:false,

message:
error.message

});

}

};