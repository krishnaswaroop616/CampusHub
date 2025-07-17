const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    bio:{
        type:String
    },
    college:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        required:true
    },
    batch:{
        type:Number,
        required:true
    },
    skills:{
        type:[String]
    },
    profilePic:{
        type:String,
        default:""
    },
    resumeUrl:{
        type:String,
        default:""
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
});

const User=mongoose.model("User",userSchema);
module.exports=User;