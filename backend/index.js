require("dotenv").config();
const express=require("express");
const cors=require("cors");
const main=require("./db");

const userRouter=require("./routes/userRoutes");
const projectRouter=require("./routes/projectRoutes");
const postRouter=require("./routes/postRoutes");

const app=express();
const port=process.env.PORT || 8080;
const url=process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.use("/api/user",userRouter);
app.use("/api/projects",projectRouter);
app.use("/api/posts",postRouter);

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
    main(url);
});