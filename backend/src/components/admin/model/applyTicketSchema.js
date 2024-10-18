const mongoose = require("mongoose");

const applyTicketSchema = new mongoose.Schema(
    {
        supportTicketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"SupportTicket",
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"patient",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        photo:{
            type:String,
            required:true
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