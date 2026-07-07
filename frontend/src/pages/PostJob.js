import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

const PostJob = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    type: "Full-time",
    category: "",
    salaryMin: "",
    salaryMax: "",
    skills: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/jobs", {
        ...form,
        salaryMin: Number(form.salaryMin) || 0,
        salaryMax: Number(form.salaryMax) || 0,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Post a new job</h2>

        {error && <div className="alert-error">{error}</div>}

        <label>Job Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Company</label>
        <input name="company" value={form.company} onChange={handleChange} required />

        <div className="form-row">
          <div>
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} required />
          </div>
          <div>
            <label>Job Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label>Category</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Engineering, Design, Sales"
        />

        <div className="form-row">
          <div>
            <label>Minimum Salary ($/yr)</label>
            <input
              type="number"
              name="salaryMin"
              value={form.salaryMin}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Maximum Salary ($/yr)</label>
            <input
              type="number"
              name="salaryMax"
              value={form.salaryMax}
              onChange={handleChange}
            />
          </div>
        </div>

        <label>Required Skills (comma separated)</label>
        <input
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
        />

        <label>Description</label>
        <textarea
          rows={6}
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
