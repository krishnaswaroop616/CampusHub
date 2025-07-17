const mongoose=require("mongoose");

const projectSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    techStack:[String],
    description:{
        type:String,
        required:true,
    },
    githubLink:{
        type:String,
        required:true,
    },
    demoLink:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
},{timestamps:true});

const Project=mongoose.model("Project",projectSchema);
module.exports=Project;