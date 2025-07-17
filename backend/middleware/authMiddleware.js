const express=require("express");
const jwt=require("jsonwebtoken");
const User=require("../models/User");


const verifyToken=async(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Invalid token"});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decoded._id||decoded.id;
        next();
    }
    catch(err){
        res.status(403).json({message:"Not authorized"});
    }
}

module.exports=verifyToken;
