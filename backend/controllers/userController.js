require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const mongoose = require("mongoose");
const Post = require("../models/Post");
const Project =require("../models/Project");

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ message: "Login successful", token, user });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error during login", error: err });
    }
}


const registerUser = async (req, res) => {
    const { name, email, password, college, branch, batch } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            college,
            branch,
            batch
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        res.status(200).json({ message: "user registered successfully", token, newUser });
    }
    catch (err) {
        res.status(500).json({ message: "Error registering user", error: err });
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching user data", error: err });
    }
}

const updateUser = async (req, res) => {
    try {
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            updates,
            { new: true }
        )
        res.json(updatedUser);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error updating profile", error: err });
    }
}

const searchUser = async (req, res) => {
    const { query } = req.query;
    if (!query || query.trim() === "") {
        return res.status(400).json({ message: "Enter a valid user" });
    }

    try {
        const regex = new RegExp(query.trim(), "i");
        const users = await User.find({
            name: regex
        }).select("name email profilePic");

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No such user" });
        }

        res.status(200).json(users);
    } catch (err) {
        console.log("Search error:", err);
        res.status(500).json({ message: "Error searching user" });
    }
};


const getFollowers = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate("followers", "name college branch profilePic");
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        res.status(200).json(user.followers);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Error fetching folowers"});
    }
}

const getFollowing=async(req,res)=>{
    try{
        const {id}=req.params;
        const user=await User.findById(id).populate("following","name profilePic college branch");
        if(!user) {
            return res.status(404).json({message:"No such user"});
        }
        res.status(200).json(user.following);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Error fetching following users"});
    }
}

const getStats=async(req,res)=>{
    try{
        const userCount=await User.countDocuments();
        const projectCount=await Project.countDocuments();
        const postCount=await Post.countDocuments();
        res.status(200).json({users:userCount,projects:projectCount,posts:postCount});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Error fetching stats"});
    }
}


const followUser = async (req, res) => {
    const targetUserId = req.params.id;
    const currentUserId = req.userId;

    if (targetUserId === currentUserId) {
        return res.status(400).json({ message: "Cannot follow yourself" });
    }

    try {
        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            currentUser.following.pull(targetUserId);
            targetUser.followers.pull(currentUserId);
        } else {
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({
            message: isFollowing ? "Unfollowed" : "Followed",
            followingCount: currentUser.following.length,
            followersCount: currentUser.followers.length,
        });
    } catch (err) {
        console.log("Error in followUser:", err);
        res.status(400).json({ message: "Error following user", error: err });
    }
};

const getPostByUser=async(req,res)=>{
    try{
        const userId=req.params.id;
        const posts=await Post.find({user:userId}).populate("user","name profilePic").sort({createdAt:-1});
        res.status(200).json(posts);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Error fetching posts"});
    }
}


const uploadProfilePic = async (req, res) => {
    try {
        const fileUrl = req.file.path;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { profilePic: fileUrl },
            { new: true }
        );
        res.status(200).json({ message: "Profile pic uploaded", user: user });
    }
    catch (err) {
        res.status(500).json({ message: "Error uploading profile pic", error: err });
    }
}






module.exports = { loginUser, registerUser, getUser, updateUser, followUser, uploadProfilePic, searchUser ,getFollowers,getFollowing,getPostByUser,getStats};