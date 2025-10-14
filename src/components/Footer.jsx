import React from "react";
import "../index.css"; // make sure CSS is imported

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} REVA AI Authenticator. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
