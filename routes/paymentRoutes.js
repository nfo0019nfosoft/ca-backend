const express = require("express");

const router = express.Router();

const {
  createOrder,
  verifyPayment,
  getUserPayments,
  refundPayment,
  downloadInvoice,
 
} = require(
  "../controllers/paymentController"
);

router.post(
  "/create-order",
  createOrder
);

router.post(
  "/verify-payment",
  verifyPayment
);

router.get(
  "/user/:userId",
  getUserPayments
);

router.post(
  "/refund",
  refundPayment
);

router.get(
  "/invoice/:paymentId",
  downloadInvoice
);



module.exports = router;