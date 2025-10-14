import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  // Send OTP
  const sendOtp = async () => {
    if (!name || !email || !phone) {
      setMessage("Please fill all fields before sending OTP.");
      return;
    }
    if (!phone.startsWith("+")) {
      setMessage("Phone must include country code, e.g., +91XXXXXXXXXX");
      return;
    }

    try {
      const res = await fetch("https://reva-ai-authenticator-backend.onrender.com/api/auth/send-otp-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setMessage("OTP sent successfully!");
      } else {
        setMessage("Error sending OTP: " + data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error sending OTP. Check backend or network.");
    }
  };

  // Verify OTP → Backend handles signup automatically
  const verifyOtp = async () => {
  if (!otp) {
    setMessage("Enter OTP to verify.");
    return;
  }

  try {
    const res = await fetch("https://reva-ai-authenticator-backend.onrender.com/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, otp }),
    });
    const data = await res.json();

    if (data.success) {
      // ✅ Save user in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Signup successful! Redirecting...");
      setTimeout(() => navigate("/authenticator"), 1500); // or wherever AuthenticatorPage is
    } else {
      setMessage(data.message || "Invalid OTP");
    }
  } catch (err) {
    console.error(err);
    setMessage("Error verifying OTP.");
  }
};


  return (
    <div className="signup">
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="+91XXXXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={sendOtp}>Send OTP</button>

      {otpSent && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify & Sign Up</button>
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Signup;
