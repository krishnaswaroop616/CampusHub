const express = require("express");
const Project = require("../models/Project");
const mongoose=require("mongoose");


const createProject = async (req, res) => {
    const { title, description, techStack, githubLink, demoLink } = req.body;
    if (!title || !description || !githubLink) {
        return res.status(400).json({ message: "Fill in the required fields" });
    }
    try {
        const newProject = new Project({
            title,
            description,
            techStack,
            githubLink,
            demoLink,
            user: req.userId
        });
        await newProject.save();
        res.status(200).json({ message: "Project added", newProject });
    }
    catch (err) {
        res.status(500).json({ message: "Error creating project", error: err });
    }
}

const getProjects = async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log("Invalid userId format:", userId);
        return res.status(400).json({ message: "Invalid userId" });
    }
    try {
        const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(projects);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching projects" });
    }
}

const updateProject = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(400).json({ message: "No such project" });
        }

        if (project.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorised to delete" });
        }
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            updates,
            { new: true },
        );
        res.status(200).json({ message: "Project details updated", updatedProject });
    }
    catch (err) {
        res.status(500).json({ message: "Error updating project details", error: err });
    }
}

const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(400).json({ message: "No such project" });
        }

        if (project.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorised to delete" });
        }
        await project.deleteOne();
        res.status(200).json({ message: "Project deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting project" });
    }
}

module.exports = { createProject, getProjects, updateProject, deleteProject };