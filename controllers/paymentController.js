const Razorpay = require("razorpay");

const crypto = require("crypto");

const Notification = require("../models/Notification");

const Activity = require("../models/Activity");

const razorpay = new Razorpay({
  key_id:
    process.env.RAZORPAY_KEY_ID,

  key_secret:
    process.env.RAZORPAY_SECRET
});

exports.createOrder =
async (req, res) => {

  try {

    const amount =
      Number(req.body.amount);

    if (!amount) {

      return res.status(400).json({

        success: false,

        message:
          "Amount is required"

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
      await razorpay
      .orders
      .create(options);

    res.status(200).json({

      success: true,

      order

    });

  }
  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

exports.verifyPayment =
async (req, res) => {
   console.log(
    "✅ VERIFY PAYMENT API HIT"
  );

  try {

    const {

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,

      userId,

        vendorId,

      amount

    } = req.body;

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_SECRET
        )
        .update(
          razorpay_order_id +
          "|" +
          razorpay_payment_id
        )
        .digest("hex");

    if (
  generatedSignature !==
  razorpay_signature
) {

  return res.status(400).json({
    success: false,
    message: "Invalid payment"
  });

}

console.log(req.body);

console.log("User ID:", userId);

console.log("Amount:", amount);

await Notification.create({

  userId,

  type: "payment",

  title: "Payment Successful",

  message:
    `Payment of ₹${amount} completed successfully.`

});




await Activity.create({

  userId,

  type:"payment",

  title:"Payment Successful",

  message:
    `You completed a payment of ₹${amount}.`

});

console.log(
  "Payment notification created successfully"
);




await Activity.create({
  vendorId,
  type:"payment",
  title:"Payment Received",
  message:`Payment of ₹${amount} received`
});





await Notification.create({
  vendorId,
  type: "payment",
  title: "Payment Received",
  message: `₹${amount} payment received`
});
console.log("PAYMENT VENDOR ID =", vendorId);

res.status(200).json({

  success: true,

  message:
    "Payment verified successfully"

});


  }
  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};