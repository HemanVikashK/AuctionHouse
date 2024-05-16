import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import LoginPopup from "../login/LoginPopup";

import "./header.css";
import { useAuth } from "../../AuthContext";

const Header = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        Auction House
      </Link>
      <ul className="nav-items">
        <li>
          <Link
            to="/"
            className="nav-link"
            style={{
              color: "#49331e",
              textDecoration: "none",

              borderRight: "1px solid black",
              paddingRight: "45px",
              paddingLeft: "45px",
              fontSize: "18px",
            }}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/bid-now"
            className="nav-link"
            style={{
              color: "#49331e",
              textDecoration: "none",

              borderRight: "1px solid black",
              paddingRight: "45px",
              paddingLeft: "45px",
              fontSize: "18px",
            }}
          >
            Bid Now
          </Link>
        </li>
        <li>
          <Link
            to="/sell-now"
            className="nav-link"
            style={{
              color: "#49331e",
              textDecoration: "none",

              borderRight: "1px solid black",
              paddingRight: "45px",
              paddingLeft: "45px",
              fontSize: "18px",
            }}
          >
            Sell Now
          </Link>
        </li>
        <li>
          <Link
            to="/bid-history"
            className="nav-link"
            style={{
              color: "#49331e",
              textDecoration: "none",

              borderRight: "1px solid black",
              paddingRight: "45px",
              paddingLeft: "45px",
              fontSize: "18px",
            }}
          >
            Bid History
          </Link>
        </li>
        <li>
          <Link
            to="/about-us"
            className="nav-link"
            style={{
              color: "#49331e",
              textDecoration: "none",
              marginRight: "10px",
              fontSize: "18px",
            }}
          >
            About Us
          </Link>
        </li>
      </ul>
      <li className="login-signup">
        {user ? (
          <>
            <span className="username">Logged in as {user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button
            className="button"
            variant="link"
            onClick={() => setShowLogin(true)}
          >
            Login / SignUp
          </button>
        )}
      </li>
    </nav>
  );
};

export default Header;
