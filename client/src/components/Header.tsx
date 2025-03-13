import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./Header.css";
import { useUser } from "./useUser";


export function Header() {
  const {user, handleSignOut} = useUser();
  console.log('This is the user', user);
  return (
    <div className="container">
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/images/logo.svg" alt="Logo" className="logo" />
        <span className="brand-name">Prime Anime</span>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/all-shows">Shows</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/reviews">Reviews</Link>
        <Link to="/about">About Us</Link>
      </div>

      <div className="auth-buttons">
        {user ? (<button onClick={handleSignOut}> Logout </button>) : (
          <>
        <Link to="/auth" className="signup-btn">Sign Up</Link>
        <Link to="/auth" className="login-btn">Login</Link>
        </>
        )}
      </div>
    </nav>
    <Outlet/>
    </div>
  );
}
