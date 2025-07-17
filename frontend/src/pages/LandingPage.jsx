import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="text-center py-4 text-light">
            <div className="container">
                <h1 className="display-4 fw-bold mb-3 text-light">Welcome to CampusHub <i className="fa-solid fa-graduation-cap text-warning"></i></h1>
                <p className="fs-5 text-light mb-4">Showcase your projects, follow peers, and grow together!</p>

                <div className="mb-5">
                    <Link to="/register" className="btn btn-warning btn-lg me-2 mb-2 mb-md-0 px-4 rounded-pill shadow">Get Started</Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg px-4 rounded-pill">Login</Link>
                </div>

                <div className="row g-4 justify-content-center">
                    <div className="col-md-5 col-12">
                        <div className="p-4 bg-dark bg-opacity-60 rounded shadow h-100">
                            <h5><i className="fa-solid fa-rocket text-danger me-2"></i>Project Sharing</h5>
                            <p className="text-light">Upload and display your best work.</p>
                        </div>
                    </div>
                    <div className="col-md-5 col-12">
                        <div className="p-4 bg-dark bg-opacity-60 rounded shadow h-100">
                            <h5><i className="fa-solid fa-users text-success me-2"></i>Follow Students</h5>
                            <p className="text-light">Explore what others are building.</p>
                        </div>
                    </div>
                    <div className="col-md-5 col-12">
                        <div className="p-4 bg-dark bg-opacity-60 rounded shadow h-100">
                            <h5><i className="fa-solid fa-globe text-info me-2"></i>Stay Connected</h5>
                            <p className="text-light">Like, comment, and support your friends.</p>
                        </div>
                    </div>
                    <div className="col-md-5 col-12">
                        <div className="p-4 bg-dark bg-opacity-60 rounded shadow h-100">
                            <h5><i className="fa-solid fa-chart-simple text-warning me-2"></i>CampusHub Stats</h5>
                            <p className="text-light">See how your community is growing.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
