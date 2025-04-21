import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Link } from "react-router-dom";
import { FaGamepad, FaBook, FaMedal } from "react-icons/fa";

const Sidebar = ({ isLoggedIn }) => {
  if (!isLoggedIn) {
    return null; // Do not render the Sidebar if the user is not logged in
  }

  return (
    <aside className="w-14 h-screen fixed top-0 left-0 bg-teal-400 flex flex-col items-center pt-24 space-y-4">
      {/* Navigation Links */}
      <nav className="flex flex-col items-center space-y-4">
        {/* Lessons Icon */}
        <Link
          to="/module"
          className="w-10 h-10 bg-teal-300 hover:bg-teal-500 rounded-lg flex items-center justify-center"
        >
          <FaBook className="text-white text-lg" />
        </Link>

        {/* Game Icon */}
        <Link
          to="/games"
          className="w-10 h-10 bg-teal-300 hover:bg-teal-500 rounded-lg flex items-center justify-center"
        >
          <FaGamepad className="text-white text-lg" />
        </Link>

        {/* Badges Icon */}
        <Link
          to="/badges"
          className="w-10 h-10 bg-teal-300 hover:bg-teal-500 rounded-lg flex items-center justify-center"
        >
          <FaMedal className="text-white text-lg" />
        </Link>
      </nav>
    </aside>
  );
};

// Add PropTypes validation
Sidebar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired, // Ensure isLoggedIn is a required boolean
};

export default Sidebar;
