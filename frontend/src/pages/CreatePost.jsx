import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const { token } = useAuth();
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text) {
            return alert("Add some text to post");
        }

        const formData = new FormData();
        formData.append("text", text);
        if (image) formData.append("image", image);

        try {
            setLoading(true);
            const res = await axios.post(`http://localhost:8080/api/posts/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            });
            alert("Post created successfully");
            setLoading(false);
            navigate("/feed");
        } catch (err) {
            console.log(err);
            alert("Error creating post");
            setLoading(false);
        }
    };

    return (
        <div className=' min-vh-100  d-flex  justify-content-center align-items-center text-white px-3 '>
            <div className=" p-3 w-50  w-md-75 w-lg-50  border border-1 shadow bg-white bg-opacity-10 rounded-4 " >
                <h4 className="text-center mb-4 fs-2 fw-bold text-warning">Create a New Post</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="text" className="form-label px-1 ">Post Content</label>
                        <textarea className='form-control ' id='text' placeholder="What's on your mind?" value={text} onChange={(e) => setText(e.target.value)} required rows={4}/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="image" className="form-label px-1 ">Upload Image (optional)</label>
                        <input className='form-control mb-4' type='file'  onChange={(e) => setImage(e.target.files[0])}/>
                    </div>

                        <button type='submit' className='btn btn-warning w-100 ' disabled={loading}>
                            {loading ? (
                                <><span className='spinner-border spinner-border-sm me-2'></span>Posting...</>
                            ) : "Create Post"}
                        </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
