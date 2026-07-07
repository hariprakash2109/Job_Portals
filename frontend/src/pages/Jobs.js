import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import JobCard from "../components/JobCard";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";
  const type = searchParams.get("type") || "";
  const page = Number(searchParams.get("page") || 1);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/jobs", {
        params: { keyword, location, type, page, limit: 6 },
      });
      setJobs(data.jobs);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [keyword, location, type, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", p);
    setSearchParams(next);
  };

  return (
    <div className="jobs-page">
      <aside className="filters">
        <h3>Filters</h3>

        <label>Keyword</label>
        <input
          defaultValue={keyword}
          placeholder="e.g. React developer"
          onBlur={(e) => updateParam("keyword", e.target.value)}
        />

        <label>Location</label>
        <input
          defaultValue={location}
          placeholder="e.g. Remote, Chennai"
          onBlur={(e) => updateParam("location", e.target.value)}
        />

        <label>Job Type</label>
        <select value={type} onChange={(e) => updateParam("type", e.target.value)}>
          <option value="">All Types</option>
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </aside>

      <section className="job-results">
        <h2>{loading ? "Searching..." : `${jobs.length} jobs on this page`}</h2>

        {!loading && jobs.length === 0 && (
          <div className="empty-state">
            No jobs match your filters yet. Try broadening your search.
          </div>
        )}

        <div className="job-grid">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>

        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={p === page ? "active" : ""}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Jobs;
