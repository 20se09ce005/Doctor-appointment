const Doctor = require("../doctor/model/doctorSchema");
const Patient = require("../patient/model/patientSchema");
const SupportTicket = require("./model/supportTicketSchema");
const ApplyTicket = require("./model/applyTicketSchema");
const ChatMessages = require("./model/chatMessagesSchema");
const common = require("../../utils/common");
const multer = require("multer");
const upload = require("../../utils/upload");
const moment = require("moment");
const io = require("../../index");
const { storageConfig, fileFilterConfig } = require("../../utils/upload");
const { default: mongoose } = require("mongoose");

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

const getAllSuportTicket = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({});
        return common.sendSuccess(req, res, { messages: "Tickets fetched successfully", data: tickets }, 200);
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const getOneSupportTicket = async (req, res) => {
    try {
        const id = req.query.id;
        const ticket = await SupportTicket.findById({ _id: id });
        return common.sendSuccess(req, res, { messages: "Tickets fetched successfully", data: ticket }, 200);
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const supportTicketCreate = async (req, res) => {
    try {
        const { title, message } = req.body;
        const newticket = new SupportTicket({
            title,
            message,
        });
        await newticket.save();
        return common.sendSuccess(req, res, { messages: "Patient registered successfully", data: newticket }, 201);
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const uploadMultipleImage = async (req, res) => {
    const imageUpload = multer({
        storage: storageConfig,
        fileFilter: fileFilterConfig,
    }).array("images");

    imageUpload(req, res, (err) => {
        if (err) {
            console.error("Multer Error:", err);
            return common.sendError(req, res, { message: "IMAGE_NOT_UPLOADED" }, 400);
        }

        if (!req.files || req.files.length === 0) {
            return common.sendError(req, res, { message: "IMAGE_NOT_FOUND" }, 400);
        }

        const filenames = req.files.map(file => file.filename);

        return common.sendSuccess(req, res, { imagePaths: filenames });
    });
};

const applyTicket = async (req, res) => {
    try {
        const userid = await Patient.findOne({ _id: req.body.userId });
        const { title, reason, photo } = req.body;

        const newapplyticket = new ApplyTicket({
            userId: userid._id,
            supportTicketId: req.body.ticketid,
            title: title,
            reason: reason,
            photo: photo
        });
        await newapplyticket.save();
        return common.sendSuccess(req, res, { messages: "Ticket applied successfully", data: newapplyticket }, 201)
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const getAllApplyTicket = async (req, res) => {
    try {
        const tickets = await ApplyTicket.find({});
        return common.sendSuccess(req, res, { messages: "Tickets fetched successfully", data: tickets }, 200);
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const getAllUserApplyTicket = async (req, res) => {
    try {
        const tickets = await ApplyTicket.find({ userId: req.body.userId });
        console.log(123)
        return common.sendSuccess(req, res, { messages: "Tickets fetched successfully", data: tickets }, 200);
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const getOneApplyTicket = async (req, res) => {
    try {
        
        const ticket = await ApplyTicket.findOne({ _id: new mongoose.Types.ObjectId(req.query.ticketId) });
        return common.sendSuccess(req, res, { messages: "Tickets fetched successfully", data: ticket }, 200);
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const ticketResponse = async (req, res) => {
    try {
        const adminId = await Patient.findOne({ _id: req.body.userId });
        const response = req.body.response;
        const reply = req.body.reply;
        const ticketId = req.body.ticketId;
        if (response == "Accept") {
            console.log(response)
            await ApplyTicket.updateOne({ _id: new mongoose.Types.ObjectId(ticketId) }, { $set: { status: 1, response: reply } });
            return common.sendSuccess(req, res, { message: "Support Ticket Accept Successfully" });
        }
        if (response == "Reject") {
            await ApplyTicket.updateOne({ _id: new mongoose.Types.ObjectId(ticketId) }, { $set: { status: 2, response: reply } });
            return common.sendSuccess(req, res, { message: "Support Ticket Reject Successfully" });
        }
        return common.sendError(req, res, { message: "Enter Response" }, 422);
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

const sendmessage = async (req, res) => {
    try {
        const adminId = await Patient.findOne({ _id: req.body.userId });
        if (!adminId) {
            return common.sendError(req, res, { message: "Admin not found" }, 404);
        }
        const message = req.body.message;
        if (!message) {
            return common.sendError(req, res, { message: "Enter Message" }, 422);
        }
        const date = Date.now();
        const formatDate = moment(date).format("DD-MM-YYYY");
        const formatTime = moment(date).format("hh:mm A");
        const ticket = await ApplyTicket.findOne({ _id: new mongoose.Types.ObjectId(req.body.ticketId) });
        const newMessage = new ChatMessages({
            time: formatTime,
            date: formatDate,
            messages: message,
            senderId: adminId._id,
            receiverId: ticket.userId,
            ticketId: ticket._id
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
    getalldoctors, getallusers, changedoctoraccountstatus, supportTicketCreate, getAllSuportTicket,
    getOneSupportTicket, applyTicket, getAllApplyTicket, getOneApplyTicket, uploadMultipleImage, sendmessage,
    getMessages, ticketResponse, getAllUserApplyTicket
}