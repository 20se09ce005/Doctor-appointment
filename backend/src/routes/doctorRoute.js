const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const doctorValidation = require("../components/doctor/doctorValidation");
const { getdoctorinfobyuserid, getdoctorinfobyid, updatedoctorprofile, getappointmentsbydoctorid, changeappointmentstatus,
    decryptionProcess }
    = require("../components/doctor/doctorController");

router.post("/get-doctor-info-by-user-id", decryptionProcess, doctorValidation.getUserIdValadation, authMiddleware, getdoctorinfobyuserid);
router.post("/get-doctor-info-by-id", decryptionProcess, doctorValidation.getDoctorIdValadation, authMiddleware, getdoctorinfobyid);
router.post("/update-doctor-profile", decryptionProcess, doctorValidation.updateDoctorValadation, authMiddleware, updatedoctorprofile);
router.get("/get-appointments-by-doctor-id", authMiddleware, getappointmentsbydoctorid);
router.post("/change-appointment-status", decryptionProcess, authMiddleware, changeappointmentstatus);

module.exports = router;