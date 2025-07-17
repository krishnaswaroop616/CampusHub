import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LeftSection = () => {
    const { userId, token } = useAuth();
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData(res.data);
            }
            catch (err) {
                console.log(err);
                alert("Error fetching user");
            }
        }
        if (token && userId) {
            getUser();
        }
    }, [userId, token]);

    return (
        <div className=' card bg-white bg-opacity-10   p-3 shadow-sm rounded-lg'> 
            <div className='d-flex flex-column align-items-center mb-1'> 
                <img src={userData.profilePic || "/profileImg.png"} alt="profile" width={80} height={80} className='rounded-circle mb-3 border border-primary' style={{ objectFit: "cover" }} /> {/* Increased size, added border-primary */}
                <h5 className='mb-1 fw-semibold text-white text-center'>{userData.name}</h5>
                <p className='text-white small text-center'>{userData.college}</p> 
            </div>
            <Link to={`/profile/${userId}`} className="btn btn-outline-warning btn-sm w-100 rounded-pill mt-1">View Profile</Link> 
        </div>
    )
}

export default LeftSection;