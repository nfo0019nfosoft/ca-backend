const SubscriptionInvoice =
require(
  "../models/SubscriptionInvoice"
);

const VendorSubscription =
require(
  "../models/VendorSubscription"
);

const Payment =
require(
  "../models/Payment"
);

const path =
require("path");

const fs =
require("fs");

/* ===========================
GENERATE INVOICE
=========================== */

exports.generateSubscriptionInvoice =
async(
  vendorId,
  subscriptionId,
  paymentId
)=>{

try{

const subscription =
await VendorSubscription
.findById(subscriptionId)
.populate("planId");

if(!subscription){
  return null;
}

const payment =
await Payment.findById(
  paymentId
);

const invoiceNumber =
`SUB-INV-${
  Date.now()
}`;

const invoice =
await SubscriptionInvoice
.create({

  vendorId,

  subscriptionId,

  paymentId,

  invoiceNumber,

  planName:
    subscription.planId.name,

  amount:
    payment.amount,

  gst:
    payment.gstAmount || 0,

  totalAmount:
    payment.totalAmount,

  billingCycle:
    subscription.billingCycle,

  status:"Paid"

});

return invoice;

}catch(error){

console.log(error);

return null;

}

};

/* ===========================
GET ALL VENDOR INVOICES
=========================== */

exports.getVendorInvoices =
async(req,res)=>{

try{

const {vendorId} =
req.params;

const invoices =
await SubscriptionInvoice
.find({
  vendorId
})
.sort({
  createdAt:-1
});

res.status(200).json(
  invoices
);

}catch(error){

console.log(error);

res.status(500).json({
  success:false,
  message:
  "Failed to fetch invoices"
});

}

};

/* ===========================
DOWNLOAD INVOICE
=========================== */

exports.downloadSubscriptionInvoice =
async(req,res)=>{

try{

const {invoiceId} =
req.params;

const invoice =
await SubscriptionInvoice
.findById(invoiceId);

if(!invoice){

return res.status(404)
.json({

success:false,
message:
"Invoice not found"

});

}

if(
  !invoice.invoicePdf
){

return res.status(404)
.json({

success:false,
message:
"Invoice PDF not generated"

});

}

const filePath =
path.join(
  __dirname,
  "..",
  invoice.invoicePdf
);

if(
  !fs.existsSync(
    filePath
  )
){

return res.status(404)
.json({

success:false,
message:
"File not found"

});

}

res.download(
  filePath
);

}catch(error){

console.log(error);

res.status(500).json({

success:false,
message:
"Invoice download failed"

});

}

};