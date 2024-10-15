const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require:true,
    },
    email: {
      type: String,
      require:true,
      lowercase:true
    },
    password: {
      type: String,
      require:true,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    seenNotifications: {
      type: Array,
      default: [],
    },
    unseenNotifications: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const patientModel = mongoose.model("patient", patientSchema);

module.exports = patientModel;