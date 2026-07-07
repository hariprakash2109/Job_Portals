import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const STATUS_OPTIONS = ["pending", "reviewed", "shortlisted", "rejected", "hired"];

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/jobs/employer/mine");
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const viewApplications = async (job) => {
    setSelectedJob(job);
    try {
      const { data } = await api.get(`/applications/job/${job._id}`);
      setApplications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job posting? This cannot be undone.")) return;
    await api.delete(`/jobs/${jobId}`);
    setJobs(jobs.filter((j) => j._id !== jobId));
    if (selectedJob?._id === jobId) {
      setSelectedJob(null);
      setApplications([]);
    }
  };

  const handleStatusChange = async (appId, status) => {
    const { data } = await api.put(`/applications/${appId}/status`, { status });
    setApplications((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: data.status } : a))
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-jobs">
        <div className="dashboard-header">
          <h2>Your Job Postings</h2>
          <Link to="/post-job" className="btn-primary btn-sm">
            + New Job
          </Link>
        </div>

        {loading && <p>Loading...</p>}
        {!loading && jobs.length === 0 && (
          <div className="empty-state">You haven't posted any jobs yet.</div>
        )}

        <div className="dashboard-job-list">
          {jobs.map((job) => (
            <div
              key={job._id}
              className={`dashboard-job-item ${
                selectedJob?._id === job._id ? "active" : ""
              }`}
            >
              <div onClick={() => viewApplications(job)}>
                <h4>{job.title}</h4>
                <p>{job.location} &middot; {job.type}</p>
              </div>
              <button className="btn-outline btn-sm" onClick={() => handleDelete(job._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-applications">
        <h2>
          {selectedJob ? `Applicants for "${selectedJob.title}"` : "Select a job to view applicants"}
        </h2>

        {selectedJob && applications.length === 0 && (
          <div className="empty-state">No applications yet for this job.</div>
        )}

        {applications.map((app) => (
          <div key={app._id} className="applicant-card">
            <div className="applicant-info">
              <h4>{app.applicant?.name}</h4>
              <p>{app.applicant?.email}</p>
              {app.applicant?.location && <p>{app.applicant.location}</p>}
              {app.applicant?.skills?.length > 0 && (
                <div className="skill-tags">
                  {app.applicant.skills.map((s) => (
                    <span key={s} className="tag">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {app.coverLetter && <p className="cover-letter">"{app.coverLetter}"</p>}
            </div>

            <select
              value={app.status}
              onChange={(e) => handleStatusChange(app._id, e.target.value)}
              className={`status-select status-${app.status}`}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
