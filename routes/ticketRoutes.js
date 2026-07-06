const express = require("express");

const router = express.Router();

const auth = require("../middleware/authmiddleware");

const upload = require("../middleware/upload");

const ticketController =
require("../controllers/ticketController");



/* ======================================
   USER / VENDOR
====================================== */

// Create Ticket
router.post(
    "/",
    auth,
    upload.single("attachment"),
    ticketController.createTicket
);

// Get Logged-in User/Vendor Tickets
router.get(
    "/my",
    auth,
    ticketController.getMyTickets
);

// Get Single Ticket
router.get(
    "/my/:id",
    auth,
    ticketController.getMyTicketById
);




/* ======================================
   ADMIN
====================================== */

// Get All Tickets
router.get(
    "/admin/all",
    auth,
    ticketController.getAllTickets
);

// Dashboard Counts
router.get(
    "/admin/counts",
    auth,
    ticketController.getTicketCounts
);

// Get Ticket By Id
router.get(
    "/admin/:id",
    auth,
    ticketController.getTicketById
);

// Reply / Update Ticket
router.put(
    "/admin/:id",
    auth,
    ticketController.replyTicket
);

// Delete Ticket
router.delete(
    "/admin/:id",
    auth,
    ticketController.deleteTicket
);

module.exports = router;