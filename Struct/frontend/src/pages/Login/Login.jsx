import React from "react";
import Navbar from "../../components/Navbar";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <>
             <div className="login-container">
                <h2 className="login-title">Welcome Back</h2>
                <form className="login-form">
                    <input type="text"placeholder="Email"className="login-input"></input>
                    <input type="password"placeholder="Password"className="login-input"></input>
                    <button type="submit" className="login-button">Confirm</button>
                </form>
                <p className="signup-text">
                    Don't Have Account?<Link to="/signup" className="signup-link">Signup</Link>
                </p>
            </div>

        </>
    );
};
export default Login;