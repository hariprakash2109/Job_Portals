import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get("/applications/mine");
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <div className="page-loading">Loading your applications...</div>;

  return (
    <div className="my-applications">
      <h2>My Applications</h2>

      {applications.length === 0 && (
        <div className="empty-state">
          You haven't applied to any jobs yet. <Link to="/jobs">Browse jobs</Link>
        </div>
      )}

      <div className="application-list">
        {applications.map((app) => (
          <div key={app._id} className="application-item">
            <div>
              <h4>{app.job?.title || "Job no longer available"}</h4>
              <p>
                {app.job?.company} &middot; {app.job?.location}
              </p>
              <p className="applied-date">
                Applied on {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`status-badge status-${app.status}`}>{app.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
