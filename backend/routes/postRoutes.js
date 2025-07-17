const express=require("express");
const { createPost, getPosts, likePost, commentPost, deletePost } = require("../controllers/postController");
const verifyToken = require("../middleware/authMiddleware");
const router=express.Router();

const {storage}=require("../config/cloud-cofig");
const multer = require("multer");

const upload=multer({storage});

router.get("/",verifyToken,getPosts);
router.post("/create",verifyToken,upload.single("image"),createPost);
router.delete("/:id",verifyToken,deletePost);
router.post("/:id/like",verifyToken,likePost);

router.post("/:id/comment",verifyToken,commentPost);

module.exports=router;