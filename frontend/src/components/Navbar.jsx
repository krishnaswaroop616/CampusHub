import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { userId, token, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return alert("Please enter a user's name to search.");
    navigate(`/search?query=${search.trim()}`);
    setSearch("");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark shadow sticky-top py-2" style={{display:token?"":"none"}}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-white fs-4" to="/">
          <i className="fas fa-graduation-cap me-2 text-warning"></i>CampusHub
        </Link>

        {token && (
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        )}

        {token && (
          <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
            <form className="mx-auto my-2 my-md-0 w-100 d-flex justify-content-center" style={{ maxWidth: '400px' }} onSubmit={handleSearch}>
              <div className="input-group">
                <input type="search" className="form-control rounded-start-pill ps-3" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                <button type="submit" className="btn btn-outline-light rounded-end-pill px-3"><i className="fas fa-search"></i></button>
              </div>
            </form>

            <ul className="navbar-nav align-items-md-center gap-3 mt-3 mt-md-0">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/feed">
                  <span ><i className="fas fa-home me-1 d-none d-lg-inline"></i>Feed</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to={`/profile/${userId}`}>
                  <span><i className="fas fa-user me-1 d-none d-lg-inline  "></i>Profile</span>
                </Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={handleLogout}>
                  <span><i className="fas fa-sign-out-alt me-2 d-none d-lg-inline "></i>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
