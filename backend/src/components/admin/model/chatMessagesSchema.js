const mongoose = require("mongoose");

const chatMessagesSchema = new mongoose.Schema(
    {
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ApplyTicket",
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "patient",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "patient",
            required: true,
        },
        messages: {
            type: String,
        },
        image: {
            type: String,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        status: {
            type: Number,
            default: 0,
        },
        deletedId:{
            type: mongoose.Schema.Types.ObjectId,
        }
    },
    { timestamps: true }
);

const chatMessagesModel = mongoose.model("ChatMessages", chatMessagesSchema);
module.exports = chatMessagesModel;