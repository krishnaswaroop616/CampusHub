import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SearchResult = () => {
    const location = useLocation();
    const { token } = useAuth();
    const [results, setResults] = useState([]);

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");

    useEffect(() => {
        const fetchResults = async () => {

            const res = await axios.get(`https://campushub-dk4a.onrender.com/api/user/search?query=${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResults(res.data);

        };

        if (query && token) fetchResults();
    }, [query, token]);

    if (!query) return <div className='text-center mt-5'>Please enter a search query.</div>;

    return (
        <div className="container text-white p-3  mt-4 bg-white bg-opacity-10 rounded-4 d-flex ">
            <div className="mt-3 ">
                <h3>Search results for "{query}"</h3>
                {results.length === 0 ? (
                    <p className='text-white'>No users found.</p>
                ) : (
                    results.map(user => (
                        <Link to={`/profile/${user._id}`} key={user._id} className="d-flex align-items-center mb-3 mt-4 text-decoration-none">
                            <img src={user.profilePic || "/profileImg.png"} alt="pfp" className="rounded-circle me-3" width={40} height={40} />
                            <div>
                                <h6 className='mb-0 text-white'>{user.name}</h6>
                                <p className='text-white small mb-0'>{user.email}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default SearchResult;
