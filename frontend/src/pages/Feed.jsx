import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { format } from "timeago.js";
import axios from 'axios';
import LeftSection from './LeftSection';
import RightSection from './RightSection';

const Feed = () => {
    const navigate = useNavigate();
    const { token, userId } = useAuth();
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState("");
    const [showCommentsForPost, setShowCommentsForPost] = useState(null);
    const [showAllComments, setShowAllComments] = useState(null);
    const [showFullImage, setShowFullImage] = useState(false);
    const [fullImage, setFullImage] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchPosts = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/posts/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPosts(res.data);
            }
            catch (err) {
                console.error("Failed to fetch posts:", err);
                alert("Failed to fetch posts");
            }
        }
        fetchPosts();
    }, [token, navigate]);

    const toggleLike = async (postId) => {
        try {
            const res = await axios.post(`http://localhost:8080/api/posts/${postId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updatedPost = res.data.post;
            setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
        }
        catch (err) {
            console.error("Error liking post:", err);
            alert("Error liking post");
        }
    }

    const toggleCommentBox = (postId) => {
        setShowCommentsForPost(prev => prev === postId ? null : postId);
    }

    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        if (!comment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        try {
            const res = await axios.post(`http://localhost:8080/api/posts/${postId}/comment`, { text: comment }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedPost = res.data.post;
            setPosts((prev) => prev.map((p) => p._id === updatedPost._id ? updatedPost : p));
            setComment("");
        }
        catch (err) {
            console.error("Error adding comment:", err);
            alert("Error adding comment");
        }
    }

    const handleShowAllComments = (postId) => {
        setShowAllComments(prev => prev === postId ? null : postId);
    };

    if (posts.length === 0) return (
        <div className='container mt-5 text-center'>
            <h1 className='display-6 text-white'>No posts to display.</h1>
            <Link to="/create-post" className='btn btn-warning btn-lg mt-2 rounded-pill shadow-sm'>Create your first post</Link>
        </div>
    );

    return (
        <div className='d-flex justify-content-center px-2 py-4 me-lg-4'>
            <div className='d-none d-lg-block me-4' style={{ width: "210px", position: "fixed", left:"0", top:"4rem"}}> 
                <LeftSection/>
            </div>

            <div style={{ width: "560px" }} > 
                <div className='d-flex flex-column align-items-center mb-3'>
                    <Link to="/create-post" className='btn btn-warning fw-semibold btn-lg rounded-pill shadow py-1'>Create new post</Link>
                </div>

                <div className='d-flex flex-column align-items-center p-2'>
                    {posts.map((post) => (
                        <div className='card mb-4 border shadow-sm w-100  bg-white bg-opacity-10 text-white' key={post._id} >
                            <div className='card-body p-4 '>
                                <div className='d-flex justify-content-between border-bottom pb-3 mb-3'>
                                    <div className="d-flex align-items-center ">
                                        <img src={post.user?.profilePic || "/profileImg.png"} alt='user profile' className='rounded-circle me-3 border border-secondary' width={48} height={48} style={{ objectFit: 'cover' }} />
                                        <div className='d-flex flex-column'>
                                            <h6 className='mb-0 fw-semibold text-white'>{post.user._id === userId ? "You" : post.user.name}</h6>
                                            <p className='small  mb-0'>{post.user.college} - {post.user.branch.length > 25 ? post.user.branch.slice(0, 25) + "..." : post.user.branch}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='fst-italic small mt-2'>{format(post.createdAt)}</p>
                                    </div>
                                </div>

                                <p className='card-text mb-3 px-1 fs-6'>{post.text}</p>
                                {post.image && (
                                    <div className="mb-3 rounded overflow-hidden" style={{ maxHeight: "500px" }}>
                                        <img src={post.image} alt='post content' style={{ cursor: "pointer" }} onClick={() => { setShowFullImage(true); setFullImage(post.image) }} className='w-100 h-100 object-fit-cover'/>
                                    </div>
                                )}

                                {showFullImage && fullImage && (
                                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75" style={{ zIndex: 1050 }} onClick={() => setShowFullImage(false)}>
                                        <img src={fullImage} alt="Full" className="img-fluid rounded shadow" style={{ maxHeight: "90%", maxWidth: "90%" }} onClick={(e) => e.stopPropagation()} />
                                        <button className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "35px", height: "35px" }} onClick={() => setShowFullImage(false)}><i className="fa-solid fa-xmark"></i></button>
                                    </div>
                                )}

                                <div className='mt-4 d-flex align-items-baseline justify-content-around pt-3'>
                                    <button className="btn btn-sm btn-link text-decoration-none p-0" onClick={() => toggleLike(post._id)}>
                                        <i className={post.likes.includes(userId) ? "fas fa-heart text-danger fs-6" : "far fa-heart text-white fs-6"}></i>
                                        <span className='ms-2 fw-semibold text-white fs-6'>{post.likes.length}</span>
                                    </button>
                                    <button className='btn btn-sm btn-link text-decoration-none p-0' onClick={() => toggleCommentBox(post._id)}>
                                        <i className="far fa-comment-dots text-white fs-6"></i>
                                        <span className='ms-2 fw-semibold text-white fs-6'>Comments</span>
                                    </button>
                                </div>

                                {showCommentsForPost === post._id && (
                                    <div className='mt-4 pt-3 border-top'>
                                        <form onSubmit={(e) => handleCommentSubmit(e, post._id)} className='d-flex mb-3'>
                                            <input type="text" placeholder="Add a comment..." className='form-control me-2 rounded-pill shadow-sm' value={comment} onChange={(e) => setComment(e.target.value)} />
                                            <button type="submit" className='btn btn-warning fw-semibold btn-sm rounded-pill px-4 shadow-sm'>Post</button>
                                        </form>

                                        {post.comments.length > 0 && (
                                            <div className='pt-2'>
                                                {(showAllComments === post._id ? post.comments : post.comments.slice(0, 2))?.map((c, i) => (
                                                    <div key={i} className='d-flex align-items-start mb-2 mt-1'>
                                                        <img className='rounded-circle me-2  border' src={c.user?.profilePic || "/profileImg.png"} width={30} height={30} style={{ objectFit: 'cover' }} alt="commenter profile" />
                                                        <p className='fs-6 fw-light'><b className='text-white  fs-6'>{c.user?.name}</b>: {c.text}</p>
                                                    </div>
                                                ))}

                                                {post.comments.length > 2 && (
                                                    <button className='btn btn-link p-0 mt-2 text-primary link-underline link-underline-opacity-0' onClick={() => handleShowAllComments(post._id)} style={{ fontSize: "0.9rem" }}>
                                                        {showAllComments === post._id ? "Hide comments" : `View all ${post.comments.length} comments`}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='d-none d-lg-block ms-4' style={{ width: "235px", position: "fixed", right: "0", top: "4rem" }}> 
                <RightSection />
            </div>
        </div>
    );
}

export default Feed;