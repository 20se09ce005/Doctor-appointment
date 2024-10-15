const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const patientValidation = require("../components/patient/patientValidation");
const { userregistration, login, getuserinfobyid, applydoctoraccount, markallnotificationsasseen, deleteallnotifications,
    getallapproveddoctors, bookappointment, checkbookingavilability, getappointmentsbyuserid, DecryptData, decryptionProcess }
    = require("../components/patient/patientController");

router.post("/register", decryptionProcess, patientValidation.patientValadation, userregistration);
router.post("/login", decryptionProcess, patientValidation.patientloginValadation, login);
router.post("/get-user-info-by-id", authMiddleware, getuserinfobyid);
router.post("/apply-doctor-account", decryptionProcess, patientValidation.applydoctoraccount, authMiddleware, applydoctoraccount);
router.post("/mark-all-notifications-as-seen", decryptionProcess, authMiddleware, markallnotificationsasseen);
router.post("/delete-all-notifications", decryptionProcess, authMiddleware, deleteallnotifications);
router.get("/get-all-approved-doctors", authMiddleware, getallapproveddoctors);
router.post("/book-appointment", decryptionProcess, patientValidation.bookappointment, authMiddleware, bookappointment);
router.post("/check-booking-avilability", decryptionProcess, patientValidation.checkbookingavilability, authMiddleware, checkbookingavilability);
router.get("/get-appointments-by-user-id", authMiddleware, getappointmentsbyuserid);
router.post("/DecryptData", DecryptData);

module.exports = router;