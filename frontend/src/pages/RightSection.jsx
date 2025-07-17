import axios from 'axios';
import React, { useState, useEffect } from 'react';

const RightSection = () => {
    const [stats, setStats] = useState({
        users: 0,
        posts: 0,
        projects: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`https://campushub-dk4a.onrender.com/api/user/stats`);
                setStats(res.data);
            }
            catch (err) {
                console.log(err);
                alert("Error fetching stats");
            }
        }
        fetchStats();
    }, []);

    return (
        <div className='card p-3 shadow-sm rounded-lg bg-white bg-opacity-10' >
            <h5 className=' fw-bold mb-4 text-white text-center'><i class="fa-solid fa-chart-simple fs-4 "></i> <span className='text-warning fs-5'>&nbsp;CampusHub Stats</span></h5> 
            <ul className="list-group list-group-flush border-top  py-2"> 
                <li className="list-group-item d-flex justify-content-between align-items-center py-2 px-0 bg-transparent border-0"> 
                    <span className=" text-white">Users</span><span className="badge bg-warning text-dark rounded-pill fs-6">{stats.users}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center py-2 px-0 bg-transparent border-0">
                    <span className=" text-white">Posts</span><span className="badge bg-warning rounded-pill text-dark fs-6">{stats.posts}</span> 
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center py-2 px-0 bg-transparent border-0">
                    <span className=" text-white">Projects</span><span className="badge bg-warning  rounded-pill text-dark fs-6">{stats.projects}</span> 
                </li>
            </ul>
        </div>
    );
}
export default RightSection;
