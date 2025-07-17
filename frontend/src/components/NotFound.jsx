import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container text-white mt-5">
            <div className="row align-items-center">
                <div className="col-12 col-md-6 text-center text-md-start mb-4 mb-md-0">
                    <h2 className="fs-1 fw-lighter">OOPS!</h2>
                    <h2 className="fs-1 fw-bold">Page not found...</h2>
                    <p className="mb-3"><i>Unable to find the page you are looking for.</i></p>
                    <Link to="/" className="btn btn-outline-warning">Return home</Link>
                </div>

                <div className="col-11 col-md-6 text-center">
                    <h1 style={{ fontSize: "9rem" }} className="fw-bold">404</h1>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
