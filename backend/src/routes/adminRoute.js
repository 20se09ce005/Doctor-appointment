const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { getalldoctors, getallusers, changedoctoraccountstatus, decryptionProcess } = require("../components/admin/adminController");

router.get("/get-all-doctors", authMiddleware, getalldoctors);
router.get("/get-all-users", authMiddleware, getallusers);
router.post("/change-doctor-account-status", decryptionProcess, authMiddleware, changedoctoraccountstatus);

module.exports = router;