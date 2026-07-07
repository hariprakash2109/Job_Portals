import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <div className="job-card-top">
        <h3>{job.title}</h3>
        <span className={`badge badge-${job.type?.toLowerCase().replace(/[^a-z]/g, "")}`}>
          {job.type}
        </span>
      </div>
      <p className="job-company">{job.company} &middot; {job.location}</p>
      <p className="job-desc">
        {job.description?.slice(0, 140)}
        {job.description?.length > 140 ? "..." : ""}
      </p>
      {(job.salaryMin || job.salaryMax) > 0 && (
        <p className="job-salary">
          ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
        </p>
      )}
      <Link to={`/jobs/${job._id}`} className="btn-primary btn-sm">
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
