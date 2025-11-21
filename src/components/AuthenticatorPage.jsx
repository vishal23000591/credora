import React, { useEffect, useState } from "react";

function AuthenticatorPage() {
  const [code, setCode] = useState("Loading...");
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user:", err);
        setError("Invalid user data");
        setCode("Error");
      }
    }
  }, []);

  // Fetch TOTP
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
      const res = await fetch(`https://credora-backend-p301.onrender.com/api/auth/current-totp?${query}`); // relative path like Login.jsx
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
      console.error("Fetch TOTP error:", err);
      setCode("Error");
      setError("Network error");
    }
  };

  // Start intervals
  useEffect(() => {
    if (!user) return;

    fetchTOTP(user); // initial fetch

    const codeInterval = setInterval(() => fetchTOTP(user), 30000);
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);

    return () => {
      clearInterval(codeInterval);
      clearInterval(countdown);
    };
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>Authenticator Code</h2>
        <p>Login to view TOTP</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Authenticator Code</h2>
      <div style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "1rem 0" }}>
        {code}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Expires in: {timer}s</p>
    </div>
  );
}

export default AuthenticatorPage;
