// src/components/Sitemap.js
import React from "react";
import { Link } from "react-router-dom";

const Sitemap = () => {
  return (
    <div>
      <h1>Sitemap</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/bid-now">Products</Link>
        </li>

        <li>
          <Link to="/bid-history">History</Link>
        </li>

        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>

        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/sell-now">About</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sitemap;
