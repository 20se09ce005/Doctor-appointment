const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const adminValidation = require("../components/admin/adminValidation");
const { upload } = require("../utils/upload");
const decryptionProcess = require("../utils/common");
const { getalldoctors, getallusers, changedoctoraccountstatus, supportTicketCreate, getAllSuportTicket,
    getOneSupportTicket, applyTicket,
    uploadPhoto,
    getAllApplyTicket,
    getOneApplyTicket, }
    = require("../components/admin/adminController");

router.get("/get-all-doctors", authMiddleware, getalldoctors);
router.get("/get-all-users", authMiddleware, getallusers);
router.post("/change-doctor-account-status", decryptionProcess.decryptionProcess, authMiddleware, changedoctoraccountstatus);
router.post("/support-ticket-create", adminValidation.supportTicketValadation, authMiddleware, supportTicketCreate);
router.get("/get-all-suport-ticket", authMiddleware, getAllSuportTicket);
router.get("/get-one-support-ticket", authMiddleware, getOneSupportTicket);
router.post('/uploadPhoto', upload.array('files', 10), uploadPhoto);
router.post("/apply-ticket", authMiddleware, applyTicket);
router.get("/get-All-Apply-Ticket", authMiddleware, getAllApplyTicket);
router.get("/get-One-Apply-Ticket", authMiddleware, getOneApplyTicket);

module.exports = router;