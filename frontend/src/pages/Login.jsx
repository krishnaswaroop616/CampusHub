import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/feed");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://campushub-dk4a.onrender.com/api/user/login", form);
      login(res.data.user._id, res.data.token);
      setLoading(false);
      alert("Login successful");
      navigate("/feed");
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <div>
      <div className='ms-1 mt-1'>
        <a href='/' className='text-warning text-decoration-none' ><i class="fa-solid fa-arrow-left-long"></i>&nbsp;&nbsp;return home</a>
      </div>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-md-6 col-lg-5 bg-dark bg-opacity-75 text-light rounded shadow p-4">
            <h2 className="text-center text-warning fw-bold mb-4">Login</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-light">Email address</label>
                <input type="email" className="form-control bg-light bg-opacity-25 text-white border-0" id="email" name="email" value={form.email} placeholder="yourname@example.com" onChange={handleChange} required />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label text-light">Password</label>
                <input type="password" className="form-control bg-light bg-opacity-25 text-white border-0" id="password" name="password" value={form.password} placeholder="Enter your password" onChange={handleChange} required />
              </div>

              <button type="submit" className="btn btn-warning w-100 fw-semibold" disabled={loading}>
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</>
                ) : "Login"}
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="text-light">Don't have an account? <Link to="/register" className="text-warning fw-semibold">Sign up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
