import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Struct Academy Logo" className="logo-img" />
        </Link>
        <h2 className="logo-text">STRUCT | ACADEMY</h2>
        <ul className="nav-links">
          <li>
            <Link to="/pricing">Pricing</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
        </ul>
      </div>

      <div className="nav-right">
        <Link to="/login" className="login-btn">
          Log in
        </Link>
        <Link to="/signup" className="signup-btn">
          Sign up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
