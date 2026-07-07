import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ""}`);
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <p className="eyebrow">Find your next role</p>
        <h1>Work that fits, one search away.</h1>
        <p className="hero-sub">
          HireLoop connects job seekers with employers hiring right now &mdash;
          no noise, just relevant openings.
        </p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by title, skill, or company..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Search Jobs
          </button>
        </form>
        <div className="hero-stats">
          <div>
            <strong>1,200+</strong>
            <span>Active Listings</span>
          </div>
          <div>
            <strong>350+</strong>
            <span>Hiring Companies</span>
          </div>
          <div>
            <strong>9,800+</strong>
            <span>Candidates Placed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
