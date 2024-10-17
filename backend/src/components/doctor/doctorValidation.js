const Validator = require("validatorjs");
const { validator } = require("../validate");

const common = require("../../utils/common");

async function getUserIdValadation(req, res, next) {
    let rules = {
        userId: "required"
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

async function getDoctorIdValadation(req, res, next) {
    let rules = {
        doctorId: "required"
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

async function updateDoctorValadation(req, res, next) {
    let rules = {
        userId: "required"
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
    getUserIdValadation, getDoctorIdValadation, updateDoctorValadation
};