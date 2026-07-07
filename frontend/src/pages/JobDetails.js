import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setMessage("");
    try {
      await api.post(`/applications/${id}`, { coverLetter });
      setApplied(true);
      setMessage("Application submitted successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not submit application");
    }
  };

  if (loading) return <div className="page-loading">Loading job...</div>;
  if (!job) return <div className="page-loading">Job not found.</div>;

  return (
    <div className="job-details">
      <div className="job-details-header">
        <h1>{job.title}</h1>
        <p className="job-company">
          {job.company} &middot; {job.location} &middot; {job.type}
        </p>
        {(job.salaryMin || job.salaryMax) > 0 && (
          <p className="job-salary">
            ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()} / year
          </p>
        )}
      </div>

      <div className="job-details-body">
        <div className="job-details-main">
          <h3>Job Description</h3>
          <p>{job.description}</p>

          {job.skills?.length > 0 && (
            <>
              <h3>Skills</h3>
              <div className="skill-tags">
                {job.skills.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="job-details-side">
          {user?.role === "jobseeker" && !applied && (
            <form className="apply-card" onSubmit={handleApply}>
              <h3>Apply for this role</h3>
              <label>Cover Letter (optional)</label>
              <textarea
                rows={5}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit..."
              />
              <button type="submit" className="btn-primary">
                Submit Application
              </button>
              {message && <p className="apply-message">{message}</p>}
            </form>
          )}

          {applied && <div className="alert-success">{message}</div>}

          {!user && (
            <div className="apply-card">
              <p>Log in as a job seeker to apply for this role.</p>
              <button className="btn-primary" onClick={() => navigate("/login")}>
                Log In to Apply
              </button>
            </div>
          )}

          {user?.role === "employer" && (
            <div className="apply-card">
              <p>You're viewing this as an employer account.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
