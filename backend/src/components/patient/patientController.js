const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("config");
const mongoose = require("mongoose")
const JWT_SECRET = config.get("JWT_SECRET");
const Patient = require("./model/patientSchema");
const Doctor = require("../doctor/model/doctorSchema");
const Appointment = require("./model/appointmentSchema");
const ChatMessages = require("../admin/model/chatMessagesSchema");
const ApplyTicket = require("../admin/model/applyTicketSchema");
const common = require("../../utils/common");
const io = require("../../index");
const { decryptData } = require("../../utils/decryption");

const userregistration = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const patientExists = await Patient.findOne({ email })
        if (patientExists) {
            return common.sendError(req, res, { messages: "Patient already exists" }, 409);
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newuser = new Patient({
            name,
            email,
            password: hashedPassword
        });
        await newuser.save();
        return common.sendSuccess(req, res, { messages: "Patient registered successfully", data: newuser }, 201);
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const login = async (req, res) => {
    try {
        const user = await Patient.findOne({ email: req.body.email });
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return common.sendError(req, res, { messages: "Password dose not match" }, 401);
        } else {
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
            console.log(token);
            return common.sendSuccess(req, res, { messages: "Login successful", data: token, id: user._id });
        }
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const getuserinfobyid = async (req, res) => {
    try {
        const user = await Patient.findOne({ _id: req.body.userId });
        user.password = undefined;
        if (!user) {
            return common.sendError(req, res, { messages: "User does not exist" }, 404);
        } else {
            return common.sendSuccess(req, res, { messages: "Patient get successfully", data: user });
        }
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const applydoctoraccount = async (req, res) => {
    try {
        const { userId, firstName, lastName, phoneNumber, website, address, specialization, experience, feePerCunsultation, timings }
            = req.body;
        const newdoctor = new Doctor({
            userId,
            firstName,
            lastName,
            phoneNumber,
            website,
            address,
            specialization,
            experience,
            feePerCunsultation,
            timings,
            status: "pending"
        })
        await newdoctor.save();
        const adminUser = await Patient.findOne({ isAdmin: true });
        const unseenNotifications = adminUser.unseenNotifications;
        unseenNotifications.push({
            type: "new-doctor-request",
            messages: `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId: newdoctor._id,
                name: newdoctor.firstName + " " + newdoctor.lastName,
            },
            onClickPath: "/admin/doctorslist",
        });
        await Patient.findByIdAndUpdate(adminUser._id, { unseenNotifications });
        return common.sendSuccess(req, res, { messages: "Doctor account applied successfully", data: newdoctor });
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const markallnotificationsasseen = async (req, res) => {
    try {
        const user = await Patient.findOne({ _id: req.body.userId });
        const unseenNotifications = user.unseenNotifications;
        const seenNotifications = user.seenNotifications;
        seenNotifications.push(...unseenNotifications);
        user.unseenNotifications = [];
        user.seenNotifications = seenNotifications;
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        return common.sendSuccess(req, res, { messages: "All notifications marked as seen", data: updatedUser, });
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const deleteallnotifications = async (req, res) => {
    try {
        const user = await Patient.findOne({ _id: req.body.userId });
        user.seenNotifications = [];
        user.unseenNotifications = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        return common.sendSuccess(req, res, { messages: "All notifications cleared", data: updatedUser, });
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const getallapproveddoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ status: "approved" });
        return common.sendSuccess(req, res, { messages: "Doctors fetched successfully", data: doctors, });
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const bookappointment = async (req, res) => {
    try {
        req.body.status = "pending";
        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        req.body.time = moment(req.body.time, "HH:mm").toISOString();
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        const user = await Patient.findOne({ _id: req.body.doctorInfo.userId });
        user.unseenNotifications.push({
            type: "new-appointment-request",
            messages: `A new appointment request has been made by ${req.body.userInfo.name}`,
            onClickPath: "/doctor/appointments",
        });
        await user.save();
        return common.sendSuccess(req, res, { messages: "Appointment booked successfully", });
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const checkbookingavilability = async (req, res) => {
    try {
        const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hours").toISOString();
        const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
        const doctorId = req.body.doctorId;
        const appointments = await Appointment.find({ doctorId, date, time: { $gte: fromTime, $lte: toTime } });
        if (appointments.length > 0) {
            return common.sendError(req, res, { messages: "Appointments not available" }, 200);
        } else {
            return common.sendSuccess(req, res, { messages: "Appointments available" });
        }
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const getappointmentsbyuserid = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.body.userId });
        return common.sendSuccess(req, res, { messages: "Appointments fetched successfully", data: appointments });
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const DecryptData = (req, res, next) => {
    try {
        const { mac, value } = req.body;

        const data = decryptData(mac, value);

        if (!data) {
            return res.status(500).json({ messages: "Decryption failed" });
        }

        return res.json({ messages: "Your Decrypted Data", data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ messages: "Server error" });
    }
}

const sendmessage = async (req, res) => {
    try {
        const userId = await Patient.findOne({ _id: req.body.userId });
        if (!userId) {
            return common.sendError(req, res, { messages: "User not found" }, 404);
        }
        const message = req.body.message;
        if (!message) {
            return common.sendError(req, res, { message: "Enter Message" }, 422);
        }
        const date = Date.now();
        const formatDate = moment(date).format("DD-MM-YYYY");
        const formatTime = moment(date).format("hh:mm A");
        const ticket = await ApplyTicket.findOne({ _id: new mongoose.Types.ObjectId(req.body.ticketId) });
        const adminId = await Patient.findOne({ role: "super-admin" });
        const newMessage = new ChatMessages({
            time: formatTime,
            date: formatDate,
            messages: message,
            senderId: userId,
            receiverId: adminId._id,
            ticketId: ticket
        });
        await newMessage.save();
        io.io.emit("response", message)
        return common.sendSuccess(req, res, { messages: "Message sent successfully" }, 200);
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const getMessages = async (req, res) => {
    try {

        const messageList = await ChatMessages.find({ ticketId: new mongoose.Types.ObjectId(req.query.ticketId) });

        return res.json(messageList);
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { message: error.message }, 500);
    }
}

module.exports = {
    userregistration, login, getuserinfobyid, applydoctoraccount, markallnotificationsasseen,
    deleteallnotifications, getallapproveddoctors, bookappointment, checkbookingavilability,
    getappointmentsbyuserid, DecryptData, sendmessage, getMessages
}