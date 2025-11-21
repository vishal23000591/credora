import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">Credora Authenticator</div>
      <div className="nav-links">
        <Link to="/">Login</Link>
        <Link to="/signup">Signup</Link>
        
      </div>
    </nav>
  );
}

export default Navbar;
