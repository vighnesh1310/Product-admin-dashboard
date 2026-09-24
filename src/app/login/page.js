"use client";

import { useState } from "react";
import { loginUser } from "../../services/authApi";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (isLoading) return;

  setError("");
  setIsLoading(true);

  try {
    const data = await loginUser(username, password);

    localStorage.setItem("token", data.accessToken);

    console.log("Login successful");
    router.push("/products");
  } catch (error) {
    setError(
      error.response?.data?.message || "Invalid username or password"
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Login
      </h1>

      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-black"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-black"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-lg bg-black px-4 py-2.5 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}