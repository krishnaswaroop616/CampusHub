import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    branch: "",
    batch: ""
  });
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
      const res = await axios.post("http://localhost:8080/api/user/register", form);
      login(res.data.newUser._id, res.data.token);
      setLoading(false);
      navigate("/feed");
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("Signup failed");
    }
  };

  return (
    <div>
      <div className='ms-1 mt-1'>
        <a href='/' className='text-warning text-decoration-none' ><i class="fa-solid fa-arrow-left-long"></i>&nbsp;&nbsp;return home</a>
      </div>
      <div className='container d-flex justify-content-center align-items-center min-vh-100'>
        <div className='row w-100 justify-content-center'>
          <div className='col-12 col-md-8 col-lg-6 bg-dark bg-opacity-75 rounded shadow p-4'>
            <h2 className='text-center text-warning fw-bold mb-4'>Create Your Account</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className='form-label text-light'>Full Name</label>
                <input type="text" className="form-control bg-light bg-opacity-25 text-white" name='name' value={form.name} onChange={handleChange} placeholder='Full Name' required />
              </div>

              <div className="mb-3">
                <label className='form-label text-light'>Email Address</label>
                <input type="email" className="form-control bg-light bg-opacity-25 text-white" name='email' value={form.email} onChange={handleChange} placeholder='yourname@example.com' required />
              </div>

              <div className="mb-3">
                <label className='form-label text-light'>College</label>
                <input type="text" className="form-control bg-light bg-opacity-25 text-white" name='college' value={form.college} onChange={handleChange} placeholder='College Name' required />
              </div>

              <div className="mb-3">
                <label className='form-label text-light'>Branch</label>
                <input type="text" className="form-control bg-light bg-opacity-25 text-white" name='branch' value={form.branch} onChange={handleChange} placeholder='Branch' required />
              </div>

              <div className="mb-3">
                <label className='form-label text-light'>Batch</label>
                <input type="number" className="form-control bg-light bg-opacity-25 text-white" name='batch' value={form.batch} onChange={handleChange} placeholder='Batch (e.g. 2025)' required />
              </div>

              <div className="mb-4">
                <label className='form-label text-light'>Password</label>
                <input type="password" className="form-control bg-light bg-opacity-25 text-white" name='password' value={form.password} onChange={handleChange} placeholder='Password' required />
              </div>

              <button type="submit" className="btn btn-warning w-100 fw-semibold" disabled={loading}>
                {loading ? (
                  <><span className='spinner-border spinner-border-sm me-2'></span> Signing Up...</>
                ) : "Sign Up"}
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="text-light">Already have an account? <Link className='text-warning fw-semibold' to="/login"> Login here</Link></p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Signup;
