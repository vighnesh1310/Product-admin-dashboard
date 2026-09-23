"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <nav>
      <h2>Product Admin</h2>

      <button onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}