const express = require("express");
const Post = require("../models/Post");

const createPost = async (req, res) => {
    const { text } = req.body;
    const image = req.file ? req.file.path : null;

    if (!text) {
        return res.status(400).json({ message: "Add content to post" });
    }
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const newPost = new Post({
            text,
            image,
            user: req.userId
        });

        await newPost.save();
        res.status(200).json({ message: "Post created successfully", newPost });
    }
    catch (err) {
        res.status(500).json({ message: "Error creating post", error: err });
    }
}

const getPosts = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const posts = await Post.find().populate("user", " _id name profilePic college branch batch").populate("comments.user", "name profilePic").sort({ createdAt: -1 });
        if (posts.length === 0) {
            return res.status(200).json({ message: "No posts to display" });
        }

        res.json(posts);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching posts", error: err });
    }
}


const likePost = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const userId = req.userId;
    try {
        const post = await Post.findById(id).populate("user", "name profilePic college branch batch").populate("comments.user", "name profilePic");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes.pull(userId);
        }
        else {
            post.likes.push(userId);
        }
        await post.save();
        const normalizedPost = {
            ...post._doc,
            likes: post.likes.map((like) => like.toString()),
        };
        res.status(200).json({ message: !isLiked ? "Post liked" : "Post disliked", liked: !isLiked, likesCount: post.likes.length, post: normalizedPost });
    }
    catch (err) {
        res.status(500).json({ message: "Error liking post", error: err });
    }
}

const commentPost = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const userId = req.userId;
    try {
        const { text } = req.body;
        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.comments.push({
            text,
            user: userId
        });
        await post.save();
        const updatedPost = await Post.findById(id).populate("user", "name profilePic college branch").populate("comments.user", "name profilePic");

        res.status(200).json({
            message: "Comment added successfully",
            post: {
                ...updatedPost._doc,
                likes: updatedPost.likes.map((like) => like.toString())
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error adding comment", error: err });
    }
}

const deletePost = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const postId  = req.params.id;
    const userId = req.userId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({ message: "No such post" });
        }
        if (post.user.toString() !== userId) {
            return res.status(400).json({ message: "Not authorized" });
        }
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post deleted" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message:"Error deleting post"});
    }
}

module.exports = { createPost, getPosts, likePost, commentPost,deletePost };