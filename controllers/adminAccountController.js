const AdminAccount = require("../models/AdminAccount");
const bcrypt = require("bcryptjs");

/* ==========================================
   CREATE NEW ADMIN
========================================== */

exports.createAdmin = async (req, res) => {

    try {

        const {
            fullName,
            email,
            phone,
            password,
            role,
            status,
            emailNotifications,
            loginAccess,
            twoFactorEnabled
        } = req.body;

        const existingAdmin = await AdminAccount.findOne({
            email
        });

        if (existingAdmin) {

            return res.status(400).json({
                success: false,
                message: "Admin already exists."
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const admin = await AdminAccount.create({

            fullName,

            email,

            phone,

            password: hashedPassword,

            profilePhoto:
                req.file
                    ? req.file.path
                    : "",

            role,

            status,

            emailNotifications,

            loginAccess,

            twoFactorEnabled,

            createdBy:
                req.user
                    ? req.user.id
                    : null

        });

        res.status(201).json({

            success: true,

            message:
                "Admin created successfully.",

            admin

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message:
                "Server Error"

        });

    }

};



/* ==========================================
   GET ALL ADMINS
========================================== */

exports.getAdmins = async (req, res) => {

    try {

        const admins =
            await AdminAccount.find()

                .select("-password")

                .sort({
                    createdAt: -1
                });

        res.json({

            success: true,

            admins

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message:
                "Server Error"

        });

    }

};



/* ==========================================
   GET SINGLE ADMIN
========================================== */

exports.getAdminById = async (req, res) => {

    try {

        const admin =
            await AdminAccount.findById(
                req.params.id
            )

                .select("-password");

        if (!admin) {

            return res.status(404).json({

                success: false,

                message:
                    "Admin not found."

            });

        }

        res.json({

            success: true,

            admin

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message:
                "Server Error"

        });

    }

};



/* ==========================================
   DELETE ADMIN
========================================== */

exports.deleteAdmin = async (req, res) => {

    try {

        const admin =
            await AdminAccount.findById(
                req.params.id
            );

        if (!admin) {

            return res.status(404).json({

                success: false,

                message:
                    "Admin not found."

            });

        }

        await admin.deleteOne();

        res.json({

            success: true,

            message:
                "Admin deleted successfully."

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message:
                "Server Error"

        });

    }

};



/* ==========================================
   UPDATE ADMIN
========================================== */

exports.updateAdmin = async (req, res) => {

    try {

        const updateData = {

            fullName:
                req.body.fullName,

            phone:
                req.body.phone,

            role:
                req.body.role,

            status:
                req.body.status,

            emailNotifications:
                req.body.emailNotifications,

            loginAccess:
                req.body.loginAccess,

            twoFactorEnabled:
                req.body.twoFactorEnabled

        };

        if (req.file) {

            updateData.profilePhoto =
                req.file.path;

        }

        const admin =
            await AdminAccount.findByIdAndUpdate(

                req.params.id,

                updateData,

                {
                    new: true
                }

            ).select("-password");

        res.json({

            success: true,

            message:
                "Admin updated successfully.",

            admin

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message:
                "Server Error"

        });

    }

};