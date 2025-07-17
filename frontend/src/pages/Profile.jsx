import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { userId, token } = useAuth();
    const [user, setUser] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [editProject,setEditProject]=useState(false);
    const [projects, setProjects] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [showFollowers, setShowFollowers] = useState(false);
    const [following, setFollowing] = useState([]);
    const [showFollowing, setShowFollowing] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const [fullPic, setFullPic] = useState("");
    const [showFull, setShowFull] = useState(false);
    const [newProj, setNewProj] = useState({
        title: "",
        description: "",
        techStack: "",
        githubLink: "",
    });
    const [showProjectForm, setShowProjectForm] = useState(false);


    useEffect(() => {

        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const fetchedUser = res.data;
                setUser(fetchedUser);

                const followers = fetchedUser.followers.map(id => id.toString());
                setIsFollowing(followers.includes(userId));
            } catch (err) {
                console.log(err);
                alert("Error fetching user");
            }
        };

        const fetchProjects = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/projects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.log(err);
                alert("Error fetching projects");
            }
        };



        if (token && userId) {
            fetchUser();
            fetchProjects();

        }
    }, [id, userId, token, userPosts]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/user/${id}/posts`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserPosts(res.data);
            }
            catch (err) {
                console.log(err);
                alert("Error fetching posts");
            }
        }
        if (token && userId) {
            fetchUserPosts();
        }
    }, [id, userId, token, userPosts]);

    const handleChange = (e) => {
        setNewProj({ ...newProj, [e.target.name]: e.target.value });
    }

    const handleDeletePost = async (postId) => {
        try {
            const res = await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserPosts((prev) =>prev.filter((p)=>p._id!==postId) );
            alert("Post deleted");
        }
        catch (err) {
            console.log(err);
            alert("Error deleting post");
        }
    }


    const handleFollow = async () => {
        try {
            await axios.post(`http://localhost:8080/api/user/${id}/follow`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFollowing(!isFollowing);
        } catch (err) {
            console.log(err);
            alert("Error occurred");
        }
    };

    const fetchFollowers = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/user/${id}/followers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFollowers(res.data);
            setShowFollowers(true);
        }
        catch (err) {
            console.log(err);
            alert("Error fetching followers");
        }
    }

    const fetchFollowing = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/user/${userId}/following`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFollowing(res.data);
            setShowFollowing(true);
        }
        catch (err) {
            console.log(err);
            alert("Error fetching followers");
        }
    }

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            const formatted = { ...newProj, techStack: newProj.techStack.split(",").map((proj) => proj.trim()) };
            const res = await axios.post(`http://localhost:8080/api/projects/create`, formatted, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Project added successfully");
            setShowProjectForm(false);
            setProjects([...projects, res.data.newProject]);
            setNewProj({
                title: "",
                description: "",
                techStack: [],
                githubLink: ""

            });

        }
        catch (err) {
            console.log(err);
            alert("Error adding profile");
            setShowProjectForm(false);
        }
    }

    const handleProjectDelete = async (projectId) => {
        try {
            const res = await axios.delete(`http://localhost:8080/api/projects/delete/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProjects((prev) => prev.filter((p) => p._id !== projectId));
            alert("Project deleted");
        }
        catch (err) {
            console.log(err);
            alert("Error deleting project");
        }
    }
    const handleProjectUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:8080/api/projects/update/${editingProject._id}`, editingProject, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProjects((prev) => prev.map((p) => p._id === editingProject._id ? res.data.updatedProject : p));
            setEditingProject(null);
            alert("Project updated");
        }
        catch (err) {
            console.log(err);
            alert("Error updating project");
        }

    }

    if (!user) return <div className="text-center mt-5 fs-2">Loading profile...</div>;

    return (
        <div className="container mt-4">
            <div className="card p-4 shadow-sm bg-white bg-opacity-10 text-white">
                <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex">
                        <img src={user.profilePic || "/profileImg.png"} alt="profile" className="rounded-circle me-3 border" width={90} height={90} style={{ objectFit: 'cover', cursor: "pointer" }} onClick={() => { setShowFull(true); setFullPic(user.profilePic || "/profileImg.png") }} />
                        <div>
                            <h4 className="mb-1">{user.name}</h4>
                            <p className=" mb-1 d-none d-md-block">{user.college}, {user.branch} ({user.batch})</p>
                            <p className="mb-2">{user.bio}</p>
                        </div>
                    </div>

                    {showFull && fullPic && (
                        <div className='position-fixed w-100 h-100 top-0 start-0 d-flex justify-content-center  align-items-center bg-dark bg-opacity-85' style={{ zIndex: 1050 }} onClick={() => setShowFull(false)}>
                            <img src={fullPic} alt="Full" className="img-fluid rounded shadow" style={{ maxHeight: "90%", maxWidth: "90%" }} onClick={(e) => e.stopPropagation()} />
                            <button className="btn btn-light position-absolute top-0 end-0 m-2" onClick={() => setShowFull(false)}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                    )}

                    {userId === user._id ? (
                        <Link to="/edit-profile" className="btn btn-outline-warning">Edit Profile</Link>
                    ) : (
                        <button className="btn btn-warning btn-sm" onClick={handleFollow}>{isFollowing ? "Unfollow" : "Follow"}</button>
                    )}
                </div>
                <div className=' mt-3 '>
                    <button className='btn btn-warning me-3' onClick={() => fetchFollowers()}>followers</button>
                    <button className='btn btn-warning' onClick={() => fetchFollowing()}>following</button>
                </div>
            </div>

            {showFollowers && (
                <div className='position-fixed p-3 rounded-3 shadow w-100  ' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1000, backgroundColor: "white", maxWidth: "400px" }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Followers ({followers.length})</h5>
                        <button className="btn btn-sm border-0" onClick={() => setShowFollowers(false)}><i class="fa-regular fa-circle-xmark fs-5"></i></button>
                    </div>

                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {followers.length === 0 ? (
                            <p className="text-muted">No followers yet.</p>
                        ) : (
                            followers.map((item, idx) => (
                                <div className="d-flex align-items-center mb-2" key={idx}>
                                    <img src={item.profilePic || "/profileImg.png"} className="rounded-circle me-2" width={30} height={30} alt="profile" />
                                    <span ><Link className='text-decoration-none text-black' onClick={()=>setShowFollowers(false)} to={`/profile/${item._id}`}>{item.name}</Link></span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {showFollowing && (
                <div className='position-fixed p-3 rounded-3 shadow w-100 ' style={{ left: "50%", transform: "translate(-50%, -50%)", zIndex: 1000, backgroundColor: "white", maxWidth: "400px" }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Following ({following.length})</h5>
                        <button className="btn btn-sm border-0 " onClick={() => setShowFollowing(false)}><i class="fa-regular fa-circle-xmark fs-5"></i></button>
                    </div>

                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {following.length === 0 ? (
                            <p className="text-muted">Not following anyone.</p>
                        ) : (
                            following.map((item, idx) => (
                                <div className="d-flex align-items-center mb-2" key={idx}>
                                    <img src={item.profilePic || "/profileImg.png"} className="rounded-circle me-2" width={30} height={30} alt="profile"/>
                                    <span><Link className='text-decoration-none text-black' onClick={()=>setShowFollowing(false)} to={`/profile/${item._id}`}>{item.name}</Link></span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {user.skills && user.skills.length > 0 && (
                <div className="card mt-5 mb-2 p-4 bg-white bg-opacity-10">
                    <h2 className='text-white'>Skills:</h2>
                    <div className='ms-1'>
                        {user.skills.map((el) => {
                            return <span className="badge bg-warning text-dark fs-6 me-2 mb-2 mt-2">{el}</span>
                        })}
                    </div>
                </div>
            )}



            <div className="card mt-4 p-3 shadow-sm mb-5 bg-white bg-opacity-10 text-white">
                <div className='d-flex justify-content-between mb-2 '>
                    <h5 className="fw-bold fs-3 mx-2">Projects</h5>
                    <a className='btn btn-warning' href='#newProject' onClick={() => { setShowProjectForm(true) }}>Add new project</a>
                </div>
                {projects.length === 0 || !projects ? (
                    <p className="ms-2 mt-3">This user hasn't added any projects yet.</p>
                ) : (
                    <div className="d-flex flex-column gap-3 ">
                        {projects.map((project) => (
                            <div className='d-flex flex-column justify-content-between'>
                                <div key={project._id} className="border rounded p-3 d-flex justify-content-between ">
                                    <div>
                                        <h6 className="mb-1 fw-semibold">{project.title}</h6>
                                        <p className="mb-1 d-none d-md-block">{project.description}</p>
                                        {project.techStack.length > 0 && <p className="text-white mb-2 small fst-italic me-3">Tech Stack: {project.techStack.join(", ")}</p>}
                                        <div>
                                            {project.githubLink && (
                                                <a href={project.githubLink} className="btn btn-outline-warning btn-sm me-2">GitHub</a>
                                            )}
                                            {project.demoLink && (
                                                <a href={project.demoLink} className="btn btn-outline-warning btn-sm">Live Demo</a>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {userId === user._id && (
                                            <div className="mt-2 ">
                                                <button className=" btn btn-sm btn-outline-warning me-2 mb-2" onClick={() => { setEditingProject(project); setEditProject(true) }}>Edit</button>
                                                <button className="btn btn-sm btn-outline-danger mb-2" onClick={() => handleProjectDelete(project._id)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    {editProject && editingProject && editingProject._id === project._id && (
                                        <div className='my-4'>
                                            <div className='d-flex justify-content-between'>
                                                <h5 className='text-warning'>Update Project</h5>
                                                <a><i className='btn fa-regular  text-white fa-circle-xmark  fs-4 ' onClick={() => setEditProject(false)}></i></a>
                                            </div>
                                            <form onSubmit={handleProjectUpdate}>
                                                <input type="text" name="title" value={editingProject.title} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })} className="form-control mb-2" placeholder="Title" />
                                                <textarea name="description" value={editingProject.description} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} className="form-control mb-2" placeholder="Description" />
                                                <input type="text" name="techStack" value={editingProject.techStack.join(", ")} onChange={(e) => setEditingProject({ ...editingProject, techStack: e.target.value.split(",").map(s => s.trim()) })} className="form-control mb-2" placeholder="Tech Stack" />
                                                <input type="url" name="githubLink" value={editingProject.githubLink} onChange={(e) => setEditingProject({ ...editingProject, githubLink: e.target.value })} className="form-control mb-2" placeholder="GitHub Link" /> <input type="text" name="demoLink" value={editingProject.demoLink} onChange={(e) => setEditingProject({ ...editingProject, demoLink: e.target.value })} className="form-control mb-2" placeholder="Demo Link" />
                                                <button type='submit' className='btn btn-warning w-100'>Update</button> 
                                            </form> 
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showProjectForm && (
                <div id='newProject'>
                    <div className='d-flex justify-content-between '>
                        <h5 className="mt-4 mx-auto fs-2 fw-semibold text-warning">Add a New Project</h5>
                        <a><i className='btn fa-regular  text-white fa-circle-xmark mt-4 fs-4 ' onClick={() => setShowProjectForm(false)}></i></a>
                    </div>
                    <form onSubmit={handleProjectSubmit} className="border rounded p-3 mb-4">
                        <div className="mb-3">
                            <input type="text" name="title" value={newProj.title} onChange={handleChange} placeholder="Project Title" className="form-control bg-white bg-opacity-50 text-white" required />
                        </div>
                        <div className="mb-3">
                            <textarea name="description" value={newProj.description} onChange={handleChange} placeholder="Project Description" className="form-control bg-white bg-opacity-50 text-white" required />
                        </div>
                        <div className="mb-3">
                            <input type="text" name="techStack" value={newProj.techStack} onChange={handleChange} placeholder="Tech Stack (comma separated)" className="form-control bg-white bg-opacity-50 text-white" />
                        </div>
                        <div className="mb-3">
                            <input type="text" name="githubLink" value={newProj.githubLink} onChange={handleChange} placeholder="GitHub Link" className="form-control bg-white bg-opacity-50 text-white" required />
                        </div>
                        <div className="mb-3">
                            <input type="url" name="demoLink" value={newProj.demoLink} onChange={handleChange} placeholder="Demo Link (optional)" className="form-control bg-white bg-opacity-50 text-white" />
                        </div>
                        <button type="submit" className="btn mt-2 w-100 btn-warning ">Add Project</button>
                    </form>

                </div>
            )}
            <div className="card mt-4 p-3 shadow-sm w-0 mb-5 bg-white bg-opacity-10">
                <h5 className="fw-bold fs-3 mb-3 text-white">Posts by {user.name}</h5>
                {userPosts.length === 0 ? (
                    <p className="text-white mt-2">No posts yet.</p>
                ) : (
                    userPosts.map(post => (
                        <div key={post._id} className="border rounded p-3 mb-3 text-white">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <p className="mb-0">{post.text}</p>
                                {user._id===userId && <button className="btn btn-sm btn-danger" onClick={() => handleDeletePost(post._id)}>Delete</button>}
                            </div>

                            {post.image && (
                                <div className="mt-2">
                                    <img src={post.image} alt="Post" className="img-fluid rounded" style={{ maxHeight: "300px", width: "50%", objectFit: "contain" }} />
                                </div>
                            )}
                        </div>

                    ))
                )}
            </div>

        </div>
    );
};

export default Profile;
