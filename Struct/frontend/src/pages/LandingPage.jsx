import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-teal-600 min-h-screen flex flex-col items-center justify-center text-white">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold tracking-wide mb-4">
          Welcome to Struct Academy
        </h1>
        <p className="text-lg font-light">Learn, play, and master arrays!</p>
      </header>

      {/* Call to Action Section */}
      <div className="flex space-x-6">
        <Link
          to="/module"
          className="bg-white text-teal-500 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100 transition duration-300"
        >
          Get Started
        </Link>
        <Link
          to="/about"
          className="bg-teal-500 border border-white px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-teal-600 transition duration-300"
        >
          Learn More
        </Link>
      </div>

      {/* Footer Section */}
      <footer className="absolute bottom-4 text-center text-sm text-white/80">
        <p>© 2025 Struct Academy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
