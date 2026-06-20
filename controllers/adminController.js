const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  try {
 console.log("ADMIN EMAIL =>", process.env.ADMIN_EMAIL);
    console.log("ADMIN PASSWORD =>", process.env.ADMIN_PASSWORD);

    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid Admin Credentials",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      token,
      role: "admin",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};