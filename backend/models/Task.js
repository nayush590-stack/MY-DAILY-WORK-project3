const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: String,
    deadline: String,
    status: { type: String, default: "Pending" },
    projectId: String
});

module.exports = mongoose.model("Task", taskSchema);