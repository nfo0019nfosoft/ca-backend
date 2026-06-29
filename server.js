const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

// ======================
// ROUTES
// ======================

const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const blogRoutes = require("./routes/blogRoutes");
const savedRoutes = require("./routes/savedRoutes");
const recentRoutes = require("./routes/recentRoutes");
const compareRoutes = require("./routes/compareRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const consultationRoutes = require("./routes/consultationRoutes");

const app = express();

// ======================
// DATABASE CONNECTION
// ======================

connectDB();

// ======================
// MIDDLEWARE
// ======================

app.use(cors());

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

// ======================
// STATIC FILES
// ======================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use(
  "/images",
  express.static(path.join(__dirname, "public/images"))
);

// ======================
// API ROUTES
// ======================

app.use("/api/auth", authRoutes);

app.use("/api/vendor", vendorRoutes);

app.use("/api/users", userRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/enquiries", enquiryRoutes);

app.use("/api/blogs", blogRoutes);

app.use("/api/saved", savedRoutes);

// ======================
// HOME ROUTE
// ======================

app.get("/", (req, res) => {
  res.send("🚀 CA Connect API Running...");
});





app.use("/api/recent", recentRoutes);
app.use("/api/compare", compareRoutes);




app.use( "/api/payment", paymentRoutes);
app.use("/api/consultations", consultationRoutes );

// ======================
// 404 ROUTE
// ======================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ======================
// ERROR HANDLER
// ======================

app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ======================
// SERVER
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});