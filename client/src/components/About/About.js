// src/components/About.js
import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <h1>About Auction House</h1>
      <div className="about-section">
        <div className="about-image-placeholder">
          <img src="placeholder.jpg" alt="Auction House" />
        </div>
        <div className="about-content">
          <p>
            Auction House is an innovative platform designed to revolutionize
            the way auctions are conducted online. Whether you're looking to buy
            or sell items, Auction House provides a dynamic and engaging
            environment for real-time bidding.
          </p>
          <p>
            With a user-friendly interface and robust features, Auction House
            ensures a seamless experience for all participants. Our platform
            supports a variety of auction types, from traditional timed auctions
            to more complex formats.
          </p>
        </div>
      </div>
      <p>
        <strong>Project Name:</strong> Auction House
      </p>
      <p>
        <strong>Developed by:</strong> Heman Vikash, CSBS 2025 Batch
      </p>
      <h2>Features</h2>
      <ul>
        <li>Real-time bidding with live updates</li>
        <li>Customizable bid timers for each auction</li>
        <li>Instant notifications for bids, wins, and losses</li>
        <li>Secure image storage using Amazon S3</li>
        <li>Detailed auction analytics and history</li>
        <li>Responsive design optimized for mobile and desktop devices</li>
        <li>Integrated payment gateway for secure transactions</li>
        <li>User profile management with purchase and bid history</li>
      </ul>
      <div className="about-section">
        <div className="about-content">
          <h2>Our Mission</h2>
          <p>
            Our mission is to create a transparent and efficient auction system
            that connects buyers and sellers in real-time. We aim to provide a
            fair and exciting bidding experience, leveraging the latest
            technologies to enhance user engagement and satisfaction.
          </p>
          <p>
            At Auction House, we believe in the power of auctions to unlock
            value and create opportunities. Our platform is built to support a
            wide range of products, from collectibles and antiques to
            electronics and vehicles.
          </p>
        </div>
        <div className="about-image-placeholder">
          <img src="mission.png" alt="Our Mission" />
        </div>
      </div>
      <div className="about-section">
        <div className="about-image-placeholder">
          <img src="team.jpg" alt="Our Team" />
        </div>
        <div className="about-content">
          <h2>Meet the Team</h2>
          <p>
            Auction House is developed by Heman Vikash, a dedicated student of
            the CSBS 2025 batch. The project is a culmination of extensive
            research, development, and testing, aimed at delivering a top-notch
            auction experience.
          </p>
          <p>
            Our team is passionate about creating innovative solutions and is
            committed to continuous improvement. We are always open to feedback
            and strive to enhance our platform to meet the evolving needs of our
            users.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
