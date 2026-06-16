
const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getProfile
} = require(
  "../controllers/authController"
);

console.log("REGISTER =", register);
console.log("LOGIN =", login);
console.log("GETPROFILE =", getProfile);
const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);
// router.post("/login", (req, res) => {
//   res.json({
//     success: true,
//     token: "test-token",
//     user: {
//       role: "user"
//     }
//   });
// });
router.get(
  "/profile",
  authMiddleware,
  getProfile
);
router.get("/test", (req, res) => {
  res.send("Auth Route Working");
});
module.exports = router;