const AdminAccount = require("../models/AdminAccount");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/sendMail");




exports.createSuperAdmin = async (req, res) => {

    try {

        const exists = await AdminAccount.findOne({
            role: "superadmin"
        });

        if (exists) {

            return res.status(400).json({
                success: false,
                message: "Super Admin already exists"
            });

        }

        const password = await bcrypt.hash(
            "Admin@123",
            10
        );

        const admin = await AdminAccount.create({

            fullName: "Super Admin",

            email: "admin@caconnect.com",

            phone: "9999999999",

            password,

            role: "superadmin",

            status: "Active",

            loginAccess: true,

            emailNotifications: true,

            twoFactorEnabled: false,

            mustChangePassword: false

        });

        res.json({

            success: true,

            message: "Super Admin Created",

            admin

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};





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















exports.getAdminById = async (req, res) => {

    try {

        const admin = await AdminAccount
            .findById(req.params.id)
            .select("-password");

        if (!admin) {

            return res.status(404).json({

                success: false,

                message: "Admin not found."

            });

        }

        res.status(200).json({

            success: true,

            admin

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};











exports.updateAdmin = async (req, res) => {

    try {

        const existingAdmin =
            await AdminAccount.findOne({

                email: req.body.email,

                _id: {
                    $ne: req.params.id
                }

            });

        if (existingAdmin) {

            return res.status(400).json({

                success: false,

                message: "Email already exists."

            });

        }

        const updateData = {

            fullName: req.body.fullName,

            email: req.body.email,

            phone: req.body.phone,

            role: req.body.role,

            status: req.body.status,

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

                    new: true,

                    runValidators: true

                }

            ).select("-password");

        if (!admin) {

            return res.status(404).json({

                success: false,

                message: "Admin not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Admin updated successfully.",

            admin

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};










exports.deleteAdmin = async (req, res) => {

    try {

        const admin =
            await AdminAccount.findById(
                req.params.id
            );

        if (!admin) {

            return res.status(404).json({

                success: false,

                message: "Admin not found."

            });

        }

        await AdminAccount.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({

            success: true,

            message:
                "Admin deleted successfully."

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};














exports.changeStatus = async (req, res) => {

    try {

        const admin =
            await AdminAccount.findByIdAndUpdate(

                req.params.id,

                {

                    status:
                        req.body.status

                },

                {

                    new: true

                }

            ).select("-password");

        if (!admin) {

            return res.status(404).json({

                success: false,

                message: "Admin not found."

            });

        }

        res.status(200).json({

            success: true,

            message:
                "Status updated successfully.",

            admin

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};












exports.sendLoginDetails = async (req, res) => {

    try {

        const {

            fullName,
            email,
            password,
            role

        } = req.body;

        const html = `

        <div style="font-family:Arial;padding:30px;background:#f5f5f5;">

            <div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:10px;">

                <h2 style="color:#2563eb;">
                    Welcome to Bussult
                </h2>

                <p>Hello <b>${fullName}</b>,</p>

                <p>Your Admin Account has been created successfully.</p>

                <table cellpadding="10">

                    <tr>

                        <td><b>Email</b></td>

                        <td>${email}</td>

                    </tr>

                    <tr>

                        <td><b>Password</b></td>

                        <td>${password}</td>

                    </tr>

                    <tr>

                        <td><b>Role</b></td>

                        <td>${role}</td>

                    </tr>

                </table>

                <br>

                <a
                href="https://bussult.vercel.app/admin"
                style="
                background:#2563eb;
                color:#fff;
                text-decoration:none;
                padding:12px 20px;
                border-radius:8px;
                display:inline-block;
                ">

                Login Now

                </a>

                <br><br>

                <p>

                    Regards,<br>

                    Bussult Team

                </p>

            </div>

        </div>

        `;

        await sendMail(

            email,

            "Bussult Login Details",

            html

        );

        res.status(200).json({

            success: true,

            message: "Login details sent successfully."

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};