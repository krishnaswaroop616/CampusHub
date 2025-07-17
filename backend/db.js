const mongoose=require("mongoose");

const main=async (url)=>{
    await mongoose.connect(url);
    console.log("DB connected");
}

module.exports=main;