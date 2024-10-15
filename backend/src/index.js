const express = require("express");
const app = express();
const config = require("config");
const path = require("path");
const mongoose = require("mongoose");

const PORT = config.get("PORT");
const MONGO_URL = config.get("MONGO_URL");

mongoose.connect(MONGO_URL);
const connection = mongoose.connection;

connection.on("connected", () => {
    console.log("MongoDB connection is successful");
});

connection.on("error", (error) => {
    console.log("Error in MongoDB connection", error);
});

const patientRoute = require("./routes/patientRoute");
const doctorRoute = require("./routes/doctorRoute");
const adminRoute = require("./routes/adminRoute");

app.use(express.json());

const cors = require("cors");
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}));

app.use("/api/patient", patientRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/admin", adminRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));