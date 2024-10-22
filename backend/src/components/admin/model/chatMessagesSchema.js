const mongoose = require("mongoose");

const chatMessagesSchema = new mongoose.Schema(
    {
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"ApplyTicket",
            required: true
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"patient",
            required: true
        },
        reciverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"patient",
            required: true
        },
        type: {
            type: Number,
            required: true
        },
        date:{
            type:String,
            required:true
        },
        time:{
            type:String,
            required:true
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

const chatMessagesModel = mongoose.model("ChatMessages", chatMessagesSchema);
module.exports = chatMessagesModel;