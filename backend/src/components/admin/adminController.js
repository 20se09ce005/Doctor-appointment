const Doctor = require("../doctor/model/doctorSchema");
const Patient = require("../patient/model/patientSchema");
const SupportTicket = require("./model/supportTicketSchema");
const ApplyTicket = require("./model/applyTicketSchema");
const common = require("../../utils/common");
const multer = require('multer');
const upload = require("../../utils/upload")

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

const uploadPhoto = async (req, res, next) => {
    try {
        const fileNames = req.files.map(file => file.filename);
        return common.sendSuccess(req, res, { files: fileNames });
    } catch (error) {
        console.log(error);
        return common.sendError(req, res, { message: error.message }, 500);
    }
};


const uploadMultipleImage = async (req, res, next) => {

    const image_ = multer({
        storage: upload.storageConfig,
        fileFilter: upload.fileFilterConfig
    }).array("images");

    image_(req, res, async (err) => {

        if (err) return common.sendError(req, res, { message: "IMAGE_NOT_UPLOADED" }, 400)

        if (!req.files || req.files.length === 0) return common.sendError(req, res, { message: "IMAGE_NOT_FOUND" }, 400)

        const image_name = req.files;

        var arr = [];

        image_name.map((element) => {
            arr.push(element.filename);
        })

        return common.sendSuccess(req, res, arr);
    }
    );
}

const applyTicket = async (req, res) => {
    try {
        const userid = await Patient.findOne({ _id: req.body.userId });
        const ticket = await SupportTicket.findOne({ _id: req.body.ticketid });

        const { title, reason, photo } = req.body;

        const newapplyticket = new ApplyTicket({
            userId: userid._id,
            supportTicketId: ticket,
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

const getOneApplyTicket = async (req, res) => {
    try {
        const ticket = await ApplyTicket.findOne({ userId: req.body.userId });
        console.log(ticket);
        return common.sendSuccess(req, res, { messages: "Tickets fetched successfully", data: ticket }, 200);
    } catch (error) {
        console.log(error)
        return common.sendError(req, res, { messages: error.message }, 500);
    }
}

module.exports = {
    getalldoctors, getallusers, changedoctoraccountstatus, supportTicketCreate, getAllSuportTicket,
    getOneSupportTicket, applyTicket, uploadPhoto, getAllApplyTicket, getOneApplyTicket, uploadMultipleImage
}