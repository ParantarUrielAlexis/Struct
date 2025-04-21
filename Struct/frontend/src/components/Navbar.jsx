import React from "react";
import PropTypes from "prop-types"; // Import PropTypes for props validation
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa"; // Import logout icon
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, username, setIsLoggedIn, setUsername }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/accounts/logout/"
      );
      if (response.status === 200) {
        // alert("Logout successful!");
        setIsLoggedIn(false);
        setUsername("");
        localStorage.removeItem("username");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error during logout:", err.response?.data || err.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Struct Academy Logo" className="logo-img" />
        </Link>
        <h2 className="logo-text">
          <Link to="/">STRUCT | ACADEMY</Link>
        </h2>
      </div>

      <div className="nav-right flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <span className="welcome-text text-teal-600 font-semibold text-lg">
              Hello, <span className="text-teal-800">{username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="logout-btn text-teal-600 hover:text-teal-800 transition duration-300"
              title="Log out"
            >
              <FaSignOutAlt size={20} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Log in
            </Link>
            <Link to="/signup" className="signup-btn">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

// Add PropTypes validation
Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired, // Ensure isLoggedIn is a required boolean
  username: PropTypes.string.isRequired, // Ensure username is a required string
  setIsLoggedIn: PropTypes.func.isRequired, // Ensure setIsLoggedIn is a required function
  setUsername: PropTypes.func.isRequired, // Ensure setUsername is a required function
};

export default Navbar;
