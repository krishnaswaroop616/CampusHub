const mongoose=require("mongoose");

const postSchema=new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:""
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments:[
        {
            text:String,
            user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
            createdAt:{type:Date,default:Date.now},
        }
    ],
},{timestamps:true});

const Post=mongoose.model("Post",postSchema);
module.exports=Post;