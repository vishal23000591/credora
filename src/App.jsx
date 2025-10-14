import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import AuthenticatorPage from "./components/AuthenticatorPage.jsx";

function App() {
  return (
    <div className="app">
      <Navbar />

      {/* Main content wrapper to avoid overlap with navbar/footer */}
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/authenticator" element={<AuthenticatorPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
