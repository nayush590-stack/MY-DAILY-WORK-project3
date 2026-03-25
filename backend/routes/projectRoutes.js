const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Create
router.post("/", async (req, res) => {
    const project = new Project(req.body);
    await project.save();
    res.json(project);
});

// Get
router.get("/", async (req, res) => {
    const projects = await Project.find();
    res.json(projects);
});

// Delete
router.delete("/:id", async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// Update
router.put("/:id", async (req, res) => {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

module.exports = router;