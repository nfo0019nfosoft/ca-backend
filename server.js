const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

/* DB CONNECT */
connectDB();

/* MIDDLEWARE */
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

/* STATIC FILES */
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

/* ROUTES */
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/vendor",
  require("./routes/vendorRoutes")
);

app.use(
  "/api/users",
  require("./routes/userRoutes")
);

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("CA Connect API Running...");
});

/* ERROR HANDLER */
app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});



const adminRoutes =
require("./routes/adminRoutes");

app.use(
  "/api/admin",
  adminRoutes
);




const enquiryRoutes =
  require("./routes/enquiryRoutes");

app.use(
  "/api/enquiries",
  enquiryRoutes
);










/* SERVER */
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server Running On Port ${PORT}`
  );
});