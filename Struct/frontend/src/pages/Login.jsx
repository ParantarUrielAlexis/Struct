import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for props validation
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Import your Struct logo

const Login = ({ updateLoginState }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/accounts/login/",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      if (response.status === 200) {
        setSuccess("Login successful!");
        localStorage.setItem("username", formData.username); // Store username in localStorage
        updateLoginState(formData.username); // Update the Navbar state
        setFormData({
          username: "",
          password: "",
        });
        navigate("/"); // Redirect to the homepage or dashboard
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="bg-gradient-to-r from-teal-600 to-teal-700 min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg relative">
        {/* Struct Logo */}
        <div className="absolute top-4 right-4">
          <img src={logo} alt="Struct Academy Logo" className="h-10" />
        </div>

        {/* Header */}
        <h2 className="text-4xl font-bold text-teal-500 text-center mb-6">
          Welcome Back!
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Log in to your account to continue learning.
        </p>

        {/* Error/Success Messages */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-teal-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
          >
            Log In
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-teal-500 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

// Add PropTypes validation
Login.propTypes = {
  updateLoginState: PropTypes.func.isRequired, // Ensure updateLoginState is a required function
};

export default Login;
