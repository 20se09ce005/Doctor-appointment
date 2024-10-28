const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const adminValidation = require("../components/admin/adminValidation");
const decryptionProcess = require("../utils/common");
const uploadImage = require("../utils/upload");

const { getalldoctors, getallusers, changedoctoraccountstatus, supportTicketCreate, getAllSuportTicket,
    getOneSupportTicket, applyTicket, getAllApplyTicket, getOneApplyTicket,
    uploadMultipleImage, sendmessage, getMessages, ticketResponse, getAllUserApplyTicket, upload }
    = require("../components/admin/adminController");

router.get("/get-all-doctors", authMiddleware, getalldoctors);
router.get("/get-all-users", authMiddleware, getallusers);
router.post("/change-doctor-account-status", decryptionProcess.decryptionProcess, authMiddleware, changedoctoraccountstatus);

router.post("/support-ticket-create", adminValidation.supportTicketValadation, authMiddleware, supportTicketCreate);
router.get("/get-all-suport-ticket", authMiddleware, getAllSuportTicket);
router.get("/get-one-support-ticket", authMiddleware, getOneSupportTicket);

router.post("/uploadMultipleImage", uploadMultipleImage);
router.post("/apply-ticket", decryptionProcess.decryptionProcess, authMiddleware, applyTicket);
router.get("/get-All-Apply-Ticket", authMiddleware, getAllApplyTicket);
router.get("/get-One-Apply-Ticket", authMiddleware, getOneApplyTicket);
router.get("/get-All-User-Apply-Ticket", authMiddleware, getAllUserApplyTicket);

router.post("/ticket-response", decryptionProcess.decryptionProcess, authMiddleware, ticketResponse)
router.post("/send-message", decryptionProcess.decryptionProcess, authMiddleware, sendmessage);
router.get("/get-Messages", getMessages);
router.post("/upload", uploadImage.uploadImage.single("image"), upload);

module.exports = router;