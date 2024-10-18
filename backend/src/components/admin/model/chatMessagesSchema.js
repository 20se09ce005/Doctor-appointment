const mongoose = require("mongoose");

const applyTicketSchema = new mongoose.Schema(
    {
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"ApplyTicket",
            required: true
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"patient",
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"patient",
            required: true
        },
        type: {
            type: Number,
            required: true
        },
        messages: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
    }
);

const applyTicketModel = mongoose.model("ApplyTicket", applyTicketSchema);
module.exports = applyTicketModel;