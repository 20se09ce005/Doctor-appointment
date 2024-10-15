const Doctor = require("./model/doctorSchema");
const Appointment = require("../patient/model/appointmentSchema");
const Patient = require("../patient/model/patientSchema");
const common = require("../../utils/common");
const { decryptData } = require("../../utils/decryption");

const getdoctorinfobyuserid = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        return common.sendSuccess(req, res, { messages: "Doctor info fetched successfully", data: doctor });
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const getdoctorinfobyid = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ _id: req.body.doctorId });
        return common.sendSuccess(req, res, { messages: "Doctor info fetched successfully", data: doctor });
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const updatedoctorprofile = async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate({ userId: req.body.userId }, req.body);
        return common.sendSuccess(req, res, { messages: "Doctor profile updated successfully", data: doctor });
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const getappointmentsbydoctorid = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        const appointments = await Appointment.find({ doctorId: doctor._id });
        console.log(req.body,"in getappointmentsbydoctorid function req body--------------------------");
        return common.sendSuccess(req, res, { messages: "Appointments fetched successfully", data: appointments });
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const changeappointmentstatus = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status, });

        const user = await Patient.findOne({ _id: appointment.userId });
        const unseenNotifications = user.unseenNotifications;
        unseenNotifications.push({
            type: "appointment-status-changed",
            messages: `Your appointment status has been ${status}`,
            onClickPath: "/appointments",
        });

        await user.save();
        return common.sendSuccess(req, res, { messages: "Appointment status updated successfully", data: appointment });
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
        console.log("req.body after decryption:", req.body);

        // res.send(decrypt);
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: "Data not encrypted properly.", error: error.message });
    }
}


module.exports = {
    getdoctorinfobyuserid, getdoctorinfobyid, updatedoctorprofile, getappointmentsbydoctorid, changeappointmentstatus,
    decryptionProcess
}