const Validator = require("validatorjs");
const { validator } = require("../validate");

const common = require("../../utils/common");

async function supportTicketValadation(req, res, next) {
    let rules = {
        title: "required|min:3|regex:/^[A-Za-z ]+$/",
        message: "required|min:3|regex:/^[A-Za-z ., ]+$/",
    };
    await validator(req.body, rules, async (errors) => {
        if (errors) {
            console.log("Error :", errors);
            return common.sendError(req, res, errors, 422);
        } else {
            next();
        }
    });
}

module.exports = {
    supportTicketValadation
};