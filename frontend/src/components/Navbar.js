import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Hari<span>Spark</span>
      </Link>

      <nav className="nav-links">
        <Link to="/jobs">Browse Jobs</Link>

        {user?.role === "employer" && (
          <>
            <Link to="/post-job">Post a Job</Link>
            <Link to="/dashboard">Dashboard</Link>
          </>
        )}

        {user?.role === "jobseeker" && (
          <Link to="/my-applications">My Applications</Link>
        )}

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-outline">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="user-pill">Hi, {user.name.split(" ")[0]}</span>
            <button className="btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
