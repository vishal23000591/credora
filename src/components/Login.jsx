import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!phone.startsWith("+")) {
      setMessage("Phone must include country code, e.g., +91XXXXXXXXXX");
      return;
    }
    try {
      const res = await fetch("https://reva-ai-authenticator-backend.onrender.com/api/auth/send-otp-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setMessage("OTP sent successfully!");
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error sending OTP. Check backend or network.");
    }
  };

  const verifyOtp = async () => {
  try {
    const res = await fetch("https://reva-ai-authenticator-backend.onrender.com/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp })
    });
    const data = await res.json();
    setMessage(data.message);

    if (data.success) {
      setOtpSent(false);

      // ✅ Save user in localStorage
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/authenticator"); // Redirect to Authenticator page after login
    }
  } catch (err) {
    console.error(err);
    setMessage("Error verifying OTP.");
  }
};


  return (
    <div className="login" style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Login</h2>

      <input
        type="text"
        placeholder="+91XXXXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "5px", border: "1px solid #ccc" }}
      />

      <button
        onClick={sendOtp}
        style={{ width: "100%", padding: "10px", marginBottom: "12px", backgroundColor: "#6a5acd", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Send OTP
      </button>

      {otpSent && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button
            onClick={verifyOtp}
            style={{ width: "100%", padding: "10px", backgroundColor: "#483d8b", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Verify OTP
          </button>
        </div>
      )}

      {message && <p style={{ marginTop: "12px", color: "lightblue" }}>{message}</p>}

      <p style={{ marginTop: "20px" }}>
        Don't have an account? <Link to="/signup" style={{ color: "#6a5acd", textDecoration: "underline" }}>Sign up here</Link>
      </p>
    </div>
  );
}

export default Login;
