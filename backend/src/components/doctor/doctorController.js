const Doctor = require("./model/doctorSchema");
const Appointment = require("../patient/model/appointmentSchema");
const Patient = require("../patient/model/patientSchema");
const Message = require("../patient/model/messagesSchema");
const common = require("../../utils/common");
const io=require("../../index");

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
        return common.sendSuccess(req, res, { messages: "Appointments fetched successfully", data: appointments });
    } catch (error) {
        // console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const changeappointmentstatus = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status, });
        const newmessage = new Message({
            userId: appointment.userId,
            doctorId: appointment.doctorId,
            message: status,
        });
        await newmessage.save();
        const Id = appointment.userId;
        const id=Id.toString();
        io.io.emit(`response ${id}`,status);
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

module.exports = {
    getdoctorinfobyuserid, getdoctorinfobyid, updatedoctorprofile, getappointmentsbydoctorid, changeappointmentstatus,
}