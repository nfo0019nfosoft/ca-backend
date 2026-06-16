

const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

const vendorRoutes = require(
  "./routes/vendorRoutes"
);

app.use(
  "/api/vendor",
  vendorRoutes
);



app.listen(
  process.env.PORT,
  () => {
    console.log("Server Running");
  }
);