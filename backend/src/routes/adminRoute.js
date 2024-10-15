const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const decryptionProcess = require("../utils/common");
const { getalldoctors, getallusers, changedoctoraccountstatus,  } = require("../components/admin/adminController");

router.get("/get-all-doctors", authMiddleware, getalldoctors);
router.get("/get-all-users", authMiddleware, getallusers);
router.post("/change-doctor-account-status", decryptionProcess.decryptionProcess, authMiddleware, changedoctoraccountstatus);

module.exports = router;