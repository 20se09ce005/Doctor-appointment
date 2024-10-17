const mongoose = require("mongoose");
const messagesSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        doctorId: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, }
);

const messagesModel = mongoose.model("messages", messagesSchema);
module.exports = messagesModel;