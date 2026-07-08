console.log("Admin Account Routes Loaded");

const express = require("express");

const router = express.Router();

const {
    createSuperAdmin,
    createAdmin,
    getAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    changeStatus,
    sendLoginDetails
} = require("../controllers/adminAccountController");

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");

const upload =
    require("../middleware/upload");

/* ==========================================
   CREATE ADMIN
========================================== */

router.post(
    "/create",
    authMiddleware,
    adminMiddleware,
    upload.single("profilePhoto"),
    createAdmin
);




/* ==========================================
   SEND LOGIN DETAILS
========================================== */

router.post(

    "/send-login",

    authMiddleware,

    adminMiddleware,

    sendLoginDetails

);


/* ==========================================
   GET ALL ADMINS
========================================== */

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAdmins
);

/* ==========================================
   GET SINGLE ADMIN
========================================== */

router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getAdminById
);

/* ==========================================
   UPDATE ADMIN
========================================== */

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    upload.single("profilePhoto"),
    updateAdmin
);

/* ==========================================
   DELETE ADMIN
========================================== */

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteAdmin
);

/* ==========================================
   CHANGE STATUS
========================================== */

router.patch(
    "/status/:id",
    authMiddleware,
    adminMiddleware,
    changeStatus
);

/* ==========================================
   CREATE SUPER ADMIN
========================================== */

router.post(
    "/create-super-admin",
    createSuperAdmin
);

module.exports = router;