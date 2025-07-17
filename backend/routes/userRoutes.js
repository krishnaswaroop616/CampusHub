const express=require("express");
const { loginUser, registerUser, getUser, followUser,uploadProfilePic, updateUser, searchUser, getFollowers, getFollowing, getPostByUser, getStats } = require("../controllers/userController");
const verifyToken=require("../middleware/authMiddleware");
const {storage}=require("../config/cloud-cofig");
const multer = require("multer");

const upload=multer({storage});

const router=express.Router();

router.post("/login",loginUser);
router.post("/register",registerUser);
router.get("/search",verifyToken,searchUser);
router.get("/stats",getStats);
router.get("/:id",verifyToken,getUser);

router.put("/update",verifyToken,updateUser);
router.post("/:id/follow",verifyToken,followUser);
router.get("/:id/followers",verifyToken,getFollowers);
router.get("/:id/following",verifyToken,getFollowing);
router.get("/:id/posts",verifyToken,getPostByUser);
router.post("/upload/profile", verifyToken,upload.single("profile"),uploadProfilePic);



module.exports=router;