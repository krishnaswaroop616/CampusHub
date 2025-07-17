import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Editprofile = () => {
    const navigate = useNavigate();
    const { userId, token } = useAuth();
    const [originalForm, setOriginalForm] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [picUploadLoading, setPicUploadLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        college: "",
        branch: "",
        batch: "",
        bio: "",
        skills: [],
    });
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`https://campushub-dk4a.onrender.com/api/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const user = res.data;
                const formatted = {
                    name: user.name || "",
                    college: user.college || "",
                    branch: user.branch || "",
                    batch: user.batch || "",
                    bio: user.bio || "",
                    skills: user.skills?.join(", ") || ""
                }
                setForm(formatted);
                setOriginalForm(formatted);
            } catch (err) {
                console.log("Error loading profile:", err);
                alert("Error loading profile");
            }
        }
        if (token && userId) {
            fetchUser();
        }
    }, [userId, token, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (JSON.stringify(form) === JSON.stringify(originalForm)) {
            alert("Add changes to save");
            return;
        }

        try {
            setEditLoading(true);
            const updatedForm = { ...form, skills: form.skills.split(",").map((el) => el.trim()) };
            await axios.put(`https://campushub-dk4a.onrender.com/api/user/update`, updatedForm, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEditLoading(false);
            alert("Profile updated successfully!");
            navigate(`/profile/${userId}`);
        } catch (err) {
            setEditLoading(false);
            console.error("Error updating profile:", err);
            alert("Error updating profile");
        }
    }

    const uploadFile = async (file, type) => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }
        setPicUploadLoading(true);
        const formData = new FormData();
        formData.append(type, file);

        try {
            const res = await axios.post(`https://campushub-dk4a.onrender.com/api/user/upload/${type}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            });
            console.log(res.data);
            setPicUploadLoading(false);
            alert("Profile picture updated successfully");
            navigate(`/profile/${userId}`);
            setProfilePic(null);
        } catch (err) {
            console.error(`Error uploading ${type}:`, err);
            alert(`Error uploading ${type}.`);
        }
    }

    return (
        <div className='container my-5 '>
            <div className='row justify-content-center '>
                <div className='col-lg-8 col-md-10 '>
                    <div className='card shadow-lg p-4 bg-white bg-opacity-10' >
                        <h3 className='card-title text-center mb-2 text-warning fw-semibold fs-1'>Edit Your Profile</h3>
                        <hr className='text-white' />

                        <form onSubmit={handleSubmit}>
                            <div className='mb-3'   >
                                <label htmlFor='name' className='form-label fw-semibold text-white'>Name</label>
                                <input type='text' id='name' className='form-control bg-white bg-opacity-25 text-white' name="name" value={form.name} onChange={handleChange} placeholder='Your full name' />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='college' className='form-label fw-semibold text-white'>College</label>
                                <input type='text' id='college' className='form-control bg-white bg-opacity-25 text-white' name="college" value={form.college} onChange={handleChange} placeholder='Your college name' />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='branch' className='form-label fw-semibold text-white'>Branch</label>
                                <input type='text' id='branch' className='form-control bg-white bg-opacity-25 text-white' name="branch" value={form.branch} onChange={handleChange} placeholder='Your academic branch' />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='batch' className='form-label fw-semibold text-white'>Batch</label>
                                <input type='number' id='batch' className='form-control bg-white bg-opacity-25 text-white' name="batch" value={form.batch} onChange={handleChange} placeholder='e.g., 2025' />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='bio' className='form-label fw-semibold text-white'>Bio</label>
                                <textarea id='bio' className='form-control bg-white bg-opacity-25 text-white' name="bio" value={form.bio} onChange={handleChange} rows="3" placeholder='Tell us a bit about yourself...'></textarea>
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='skills' className='form-label fw-semibold text-white'>Skills (comma-separated)</label>
                                <input type="text" id='skills' className='form-control  bg-white bg-opacity-25 text-white' name="skills" value={form.skills} onChange={handleChange} placeholder='e.g., React, Node.js, Python, Figma' />
                                <p className="form-text text-muted">Separate skills with commas (e.g., JavaScript, React, CSS)</p>
                            </div>
                            <div className='text-center'>
                                <button type="submit" className='btn btn-warning fw-semibold w-100 w-md-75 w-sm-50  rounded-pill shadow-sm' disabled={editLoading}><span className={editLoading ? "spinner-border spinner-border-sm" : " "}></span> Update Profile</button>
                            </div>
                        </form>

                        <hr className="my-4" />
                        <div className='mb-5'>
                            <h4 className='text-center mb-3 text-warning'>Upload Profile Picture</h4>
                            <div className='input-group'>
                                <input type='file' className='form-control' id='profilePicUpload' accept='image/*' onChange={(e) => setProfilePic(e.target.files[0])} />
                                <button className='btn btn-outline-warning' type='button' onClick={() => uploadFile(profilePic, "profile")} disabled={!profilePic || picUploadLoading} ><span className={picUploadLoading ? 'spinner-border spinner-border-sm ' : ""}></span> Upload Pic</button>
                            </div>
                            <p className="form-text text-white">Max file size: 1MB. Formats: JPG, PNG.</p>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default Editprofile;
