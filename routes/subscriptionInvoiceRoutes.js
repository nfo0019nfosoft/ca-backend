const express =
require("express");

const router =
express.Router();

const {

getVendorInvoices,

downloadSubscriptionInvoice

} = require(
"../controllers/subscriptionInvoiceController"
);

router.get(
"/vendor/:vendorId",
getVendorInvoices
);

router.get(
"/download/:invoiceId",
downloadSubscriptionInvoice
);

module.exports =
router;