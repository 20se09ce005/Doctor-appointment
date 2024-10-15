const Doctor = require("../doctor/model/doctorSchema");
const Patient = require("../patient/model/patientSchema");
const common = require("../../utils/common");
const { decryptData } = require("../../utils/decryption");

const getalldoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        return common.sendSuccess(req, res, { messages: "Doctor info fetched successfully", data: doctors });
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const getallusers = async (req, res) => {
    try {
        const users = await Patient.find({});
        return common.sendSuccess(req, res, { messages: "Users fetched successfully", data: users });
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const changedoctoraccountstatus = async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(doctorId, { status, });

        const user = await Patient.findOne({ _id: doctor.userId });
        const unseenNotifications = user.unseenNotifications;
        unseenNotifications.push({
            type: "new-doctor-request-changed",
            messages: `Your doctor account has been ${status}`,
            onClickPath: "/notifications",
        });

        user.isDoctor = status === "approved" ? true : false;
        await user.save();
        return common.sendSuccess(req, res, { messages: "Doctor status updated successfully", data: doctor });
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const decryptionProcess = async (req, res, next) => {
    try {
        const { mac, value } = req.body;
        const decrypt = await decryptData(mac, value);

        req.body = decrypt;
        console.log("req.data after decryption:", req.body);

        // res.send(decrypt);
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: "Data not encrypted properly.", error: error.message });
    }
}

module.exports = { getalldoctors, getallusers, changedoctoraccountstatus, decryptionProcess }