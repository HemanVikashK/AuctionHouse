import React from "react";
import "./footer.css";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__addr">
        <h1 className="footer__logo">Auction House</h1>

        <h2>Contact</h2>

        <address>
          6382361673
          <br />
          <a className="footer__btn" href="mailto:khemanvikash@gmail.com">
            Email Us
          </a>
        </address>
      </div>

      <ul className="footer__nav">
        <li className="nav__item">
          <h2 className="nav__title">Features</h2>

          <ul className="nav__ul">
            <li>
              <a href="#">Real-Time Bidding</a>
            </li>

            <li>
              <a href="#">Bid Timers</a>
            </li>

            <li>
              <a href="#">Cloud Storage</a>
            </li>
          </ul>
        </li>

        <li className="nav__item nav__item--extra">
          <h2 className="nav__title">TechStack</h2>

          <ul className="nav__ul nav__ul--extra">
            <li>
              <a href="#">React JS</a>
            </li>

            <li>
              <a href="#">Node js</a>
            </li>

            <li>
              <a href="#">Socket IO</a>
            </li>

            <li>
              <a href="#">AWS S3</a>
            </li>

            <li>
              <a href="#">AWS EC2</a>
            </li>

            <li>
              <a href="#">Railway PG</a>
            </li>
          </ul>
        </li>

        <li className="nav__item">
          <h2 className="nav__title">Legal</h2>

          <ul className="nav__ul">
            <li>
              <a href="home">Home</a>
            </li>

            <li>
              <a href="#">Terms of Use</a>
            </li>

            <li>
              <a href="sitemap">Sitemap</a>
            </li>
          </ul>
        </li>
      </ul>

      <div className="legal">
        <p>&copy; 2023 </p>

        <div className="legal__links">
          <span>
            Made with <span className="heart">♥</span> Passion
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
