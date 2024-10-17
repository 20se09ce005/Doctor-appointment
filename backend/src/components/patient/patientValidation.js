const Validator = require("validatorjs");
const { validator } = require("../validate");

const common = require("../../utils/common");

async function patientValadation(req, res, next) {
    let rules = {
        name: "required|min:3|regex:/^[A-Za-z ]+$/",
        email: "required|unique_email|email|regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/",
        password: "required",
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

async function patientloginValadation(req, res, next) {
    let rules = {
        email: "required|email|regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/",
        password: "required",
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

async function applydoctoraccount(req, res, next) {

    let rules = {
        firstName: "required|min:3|regex:/^[A-Za-z ]+$/",
        lastName: "required|min:3|regex:/^[A-Za-z ]+$/",
        phoneNumber: "required|unique_phoneNo|regex:/^[0-9]{10}$/",
        website: ["required"],
        specialization: "required|min:3|regex:/^[A-Za-z ]+$/",
        experience: ["required", "regex:/^[0-9]{1,2}$/"],
        address: "required|string|min:3|max:100|regex:/^[a-zA-Z0-9 ,.]+$/",
        feePerCunsultation: ["required", "regex:/^[0-9]{1,9}$/"],
        timings: ["required", "regex:^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$"],
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

async function bookappointment(req, res, next) {

    let rules = {
        userId: ["required"],
        doctorId: ["required"],
        doctorInfo: {
            _id: ["required"],
            userId: ["required"],
            firstName: "required|min:3|regex:/^[A-Za-z ]+$/",
            lastName: "required|min:3|regex:/^[A-Za-z ]+$/",
            phoneNumber: "required|regex:/^[0-9]{10}$/",
            website: ["required"],
            address: "required|string|min:3|max:100|regex:/^[a-zA-Z0-9 ,.]+$/",
            specialization: "required|min:3|regex:/^[A-Za-z ]+$/",
            experience: ["required", "regex:/^[0-9]{1,2}$/"],
            feePerCunsultation: ["required", "regex:/^[0-9]{1,9}$/"],
        },
        userInfo: {
            _id: ["required"],
            name: "required|min:3|regex:/^[A-Za-z ]+$/",
            email: "required|email|regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/",
        },
        date: ["required",],
        // "date","regex:/^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
        time: ["required",],
        // "regex:^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$"
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

async function checkbookingavilability(req, res, next) {
    let rules = {
        doctorId: ["required"],
        date: ["required",],
        //  "date","regex:/^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
        time: ["required",],
        // "regex:^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$"
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
    patientValadation, patientloginValadation, applydoctoraccount, bookappointment, checkbookingavilability
};