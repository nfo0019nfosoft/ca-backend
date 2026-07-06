const Ticket = require("../models/Ticket");
const Notification = require("../models/Notification");

/* ==========================================
   CREATE TICKET
========================================== */

exports.createTicket = async (req, res) => {

    try {

        console.log("REQ USER =>", req.user);

        const role =
            req.user?.role ||
            (req.user?.vendorId
                ? "vendor"
                : "user");

        const {
            category,
            subject,
            description,
            priority
        } = req.body;

        const attachment =
            req.file
                ? req.file.path
                : "";

        const ticket =
            await Ticket.create({

                ticketId:
                    "TK" + Date.now(),

                raisedBy:
                    role,

                userId:
                    role === "user"
                        ? req.user.id
                        : null,

                vendorId:
                    role === "vendor"
                        ? req.user.id
                        : null,

                category,

                subject,

                description,

                priority:
                    priority || "Medium",

                attachment,

                status:
                    "Open",

                messages: [
                    {
                        sender: role,
                        message: description,
                        createdAt:
                            new Date()
                    }
                ]

            });

        res.status(201).json({

            success: true,

            message:
                "Ticket created successfully",

            ticket

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

};


/* ==========================================
   GET MY TICKETS
========================================== */

exports.getMyTickets = async (req, res) => {

    try {

        let query = {};

        if (req.user.role === "user") {

            query.userId = req.user.id;

        }

        if (req.user.role === "vendor") {

            query.vendorId = req.user.id;

        }

        const tickets = await Ticket.find(query)
            .sort({
                createdAt: -1
            });

        res.json({

            success: true,

            tickets

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};



/* ==========================================
   GET MY SINGLE TICKET
========================================== */

exports.getMyTicketById = async (req, res) => {

    try {

        let query = {

            _id: req.params.id

        };

        if (req.user.role === "user") {

            query.userId = req.user.id;

        }

        if (req.user.role === "vendor") {

            query.vendorId = req.user.id;

        }

        const ticket = await Ticket.findOne(query);

        if (!ticket) {

            return res.status(404).json({

                success: false,

                message: "Ticket not found"

            });

        }

        res.json({

            success: true,

            ticket

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};



/* ==========================================
   ADMIN - GET ALL TICKETS
========================================== */

exports.getAllTickets = async (req, res) => {

    try {

        const tickets = await Ticket.find()

            .populate(
                "userId",
                "name email phone"
            )

            .populate(
                "vendorId",
                "fullName firmName email phone"
            )

            .sort({
                createdAt: -1
            });

        res.json({

            success: true,

            tickets

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};



/* ==========================================
   ADMIN - GET COUNTS
========================================== */

exports.getTicketCounts = async (req, res) => {

    try {

        const open =
            await Ticket.countDocuments({
                status: "Open"
            });

        const progress =
            await Ticket.countDocuments({
                status: "In Progress"
            });

        const resolved =
            await Ticket.countDocuments({
                status: "Resolved"
            });

        const closed =
            await Ticket.countDocuments({
                status: "Closed"
            });

        res.json({

            success: true,

            total:
                open +
                progress +
                resolved +
                closed,

            open,

            progress,

            resolved,

            closed

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};



/* ==========================================
   ADMIN - GET SINGLE TICKET
========================================== */

exports.getTicketById = async (req, res) => {

    try {

        const ticket = await Ticket.findById(
            req.params.id
        )

            .populate("userId")

            .populate("vendorId");

        if (!ticket) {

            return res.status(404).json({

                success: false,

                message: "Ticket not found"

            });

        }

        res.json({

            success: true,

            ticket

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};



/* ==========================================
   ADMIN - REPLY TICKET
========================================== */

exports.replyTicket = async (req, res) => {

    try {

        const {
            message,
            status
        } = req.body;

        const ticket =
            await Ticket.findById(
                req.params.id
            );

        if (!ticket) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }

        ticket.messages.push({

            sender: "admin",

            message,

            createdAt:
                new Date()

        });

        if (status) {

            ticket.status =
                status;

        }

        await ticket.save();


        if (ticket.userId) {


await Notification.create({

    userId: ticket.userId,

    title: "Support Ticket Updated",

  message:
`Your support ticket "${ticket.subject}" has received a reply.`,

    ticketId:
        ticket._id

});

        }


        if (ticket.vendorId) {

       await Notification.create({

    vendorId: ticket.vendorId,

    title: "Support Ticket Updated",

   message:
`Your support ticket "${ticket.subject}" has received a reply.`,

    ticketId:
        ticket._id

});
        }

        res.json({

            success: true,

            message:
                "Reply sent successfully",

            ticket

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

};



/* ==========================================
   ADMIN - DELETE TICKET
========================================== */

exports.deleteTicket = async (req, res) => {

    try {

        const ticket = await Ticket.findById(
            req.params.id
        );

        if (!ticket) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }

        await Ticket.findByIdAndDelete(
            req.params.id
        );

        res.json({

            success: true,

            message:
                "Ticket deleted successfully"

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};














exports.updateTicketStatus =
async (req, res) => {

    try {

        const ticket =
            await Ticket.findById(
                req.params.id
            );

        if (!ticket) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }

        ticket.status =
            req.body.status;

        await ticket.save();

        res.json({

            success: true,

            message:
                "Status updated successfully",

            ticket

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

};