const { EncryptData } = require("./encryption");
const { decryptData } = require("./decryption");

const sendSuccess = async (req, res, data) => {
    if (req.headers.env && req.headers.env === "test") {
        res.json(data);
    } else {
        const responseData = await EncryptData(req, res, data);
        res.json(responseData);
    }
};

const sendError = async (req, res, message, status) => {
    res.status(status).send(message).json();
};

const decryptionProcess = async (req, res, next) => {
    try {
        const { mac, value } = req.body;
        const decrypt = await decryptData(mac, value);
        req.body = { ...decrypt };
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: "Data not encrypted properly.", error: error.message });
    }
}

module.exports = { sendError, sendSuccess, decryptionProcess};