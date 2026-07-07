import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
    company: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create your account</h2>
        <p className="auth-sub">Join HireLoop as a candidate or an employer</p>

        {error && <div className="alert-error">{error}</div>}

        <label>I am a...</label>
        <div className="role-toggle">
          <button
            type="button"
            className={form.role === "jobseeker" ? "active" : ""}
            onClick={() => setForm({ ...form, role: "jobseeker" })}
          >
            Job Seeker
          </button>
          <button
            type="button"
            className={form.role === "employer" ? "active" : ""}
            onClick={() => setForm({ ...form, role: "employer" })}
          >
            Employer
          </button>
        </div>

        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        {form.role === "employer" && (
          <>
            <label>Company Name</label>
            <input name="company" value={form.company} onChange={handleChange} />
          </>
        )}

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          minLength={6}
          required
        />

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
