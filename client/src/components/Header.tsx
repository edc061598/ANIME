import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./Header.css";

export function Header() {
  return (
    <div className="container">
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/images/logo.svg" alt="Logo" className="logo" />
        <span className="brand-name">Prime Anime</span>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/shows">Shows</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/reviews">Reviews</Link>
        <Link to="/about">About Us</Link>
      </div>

      <div className="auth-buttons">
        <Link to="/signup" className="signup-btn">Sign Up</Link>
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </nav>
    <Outlet/>
    </div>
  );
}
