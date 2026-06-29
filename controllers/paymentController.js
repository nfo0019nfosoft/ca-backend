const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {

    console.log("BODY:", req.body);

    const amount = Number(req.body.amount);

    console.log("AMOUNT:", amount);

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    console.log("OPTIONS:", options);

    const order = await razorpay.orders.create(options);

    console.log("ORDER CREATED:", order);

    res.status(200).json(order);

  } catch (error) {

    console.log("RAZORPAY ERROR =>");
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.error?.description || error.message,
      error
    });
  }
};