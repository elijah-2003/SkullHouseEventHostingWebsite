import React from 'react';
import './Footer.css'; // Import your Footer.css for styling

function Footer() {
  return (
    <footer className="footer-container">
      <hr className="line-separator" />
      <div className="footer-content">
        <a
          href="https://pks.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Phi Kappa Sigma International Fraternity
        </a>
        <p className="address">530 Beacon Street, Boston, MA, 02215</p>
      </div>
    </footer>
  );
}

export default Footer;