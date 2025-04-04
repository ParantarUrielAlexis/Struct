import React from "react";
import Navbar from "../../components/Navbar";
import "./Signup.css";
import { Link } from "react-router-dom";

const Signup = () => {
    return (
        <>
            <div className="signup-container">
                <h2 className="signup-title">Create an Account</h2>
                <form className="signup-form">
                    <input type="text"placeholder="Email"className="signup-input"></input>
                    <input type="password"placeholder="Password"className="signup-input"></input>
                    <input type="password"placeholder="Confirm Password"className="signup-input"></input>
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>
                <p className="login-text">
                    Already have an account?<Link to="/login" className="login-link">Log in</Link>
                </p>
            </div>

        </>
    );
};
export default Signup;