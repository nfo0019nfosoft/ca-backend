const express = require("express");

const router = express.Router();

const {
    createAdmin,
    getAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
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

module.exports = router;