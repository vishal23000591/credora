import React, { useEffect, useState } from "react";

export default function AuthenticatorCode() {
  const [code, setCode] = useState("Loading...");
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Load user from localStorage once
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
        setError("Invalid user data");
        setCode("Error");
      }
    }
  }, []);

  // Fetch TOTP function
  const fetchTOTP = async (currentUser) => {
    if (!currentUser?.email && !currentUser?.mobile) {
      setError("Email or phone required");
      setCode("Error");
      return;
    }

    const query = currentUser.email
      ? `email=${encodeURIComponent(currentUser.email)}`
      : `phone=${encodeURIComponent(currentUser.mobile)}`;

    try {
      const res = await fetch(`https://credora-backend-p301.onrender.com/api/auth/current-totp?email=${encodeURIComponent(user.email)}`
);
      const data = await res.json();

      if (data.success && data.code) {
        setCode(data.code);
        setTimer(30);
        setError("");
      } else {
        setCode("Error");
        setError(data.error || "Unable to fetch TOTP");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setCode("Error");
      setError("Network error");
    }
  };

  // Fetch TOTP only after user is loaded
  useEffect(() => {
    if (!user) return;

    fetchTOTP(user); // fetch immediately

    const codeInterval = setInterval(() => fetchTOTP(user), 30000); // refresh every 30s
    const countdown = setInterval(() => setTimer((prev) => (prev > 0 ? prev - 1 : 30)), 1000);

    return () => {
      clearInterval(codeInterval);
      clearInterval(countdown);
    };
  }, [user]);

  if (!user)
    return (
      <div style={{ textAlign: "center", padding: "1rem" }}>
        <h2>Authenticator Code</h2>
        <p>Login to view TOTP</p>
      </div>
    );

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        textAlign: "center",
        padding: "2rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Authenticator Code</h2>
      <div
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          margin: "1rem 0",
        }}
      >
        {code}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Expires in: {timer}s</p>
    </div>
  );
}
