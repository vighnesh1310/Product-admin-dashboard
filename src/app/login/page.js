"use client";

import { useState } from "react";
import { loginUser } from "../../services/authApi";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (isLoading) return;

  setError("");
  setIsLoading(true);

  try {
    const data = await loginUser(username, password);

    localStorage.setItem("token", data.accessToken);

    console.log("Login successful");
  } catch (error) {
    setError(
      error.response?.data?.message || "Invalid username or password"
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
            type="submit"
            disabled={isLoading}
        >
            {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}