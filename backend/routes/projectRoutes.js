const express=require("express");
const { createProject, getProjects, deleteProject, updateProject } = require("../controllers/projectController");
const verifyToken = require("../middleware/authMiddleware");


const router=express.Router();

router.post("/create",verifyToken,createProject);
router.get("/:userId",verifyToken,getProjects);
router.put("/update/:id",verifyToken,updateProject);
router.delete("/delete/:id",verifyToken,deleteProject);

module.exports=router;
