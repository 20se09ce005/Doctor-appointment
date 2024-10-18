const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        message: {
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

const supportTicketModel = mongoose.model("SupportTicket", supportTicketSchema);

module.exports = supportTicketModel;