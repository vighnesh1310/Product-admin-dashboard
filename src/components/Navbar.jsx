"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
  <nav className="border-b bg-white">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
      <button
        onClick={() => router.push("/products")}
        className="text-xl font-bold"
      >
        Product Manager
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/products")}
          className="text-sm font-medium text-gray-700 hover:text-black"
        >
          Products
        </button>

        <button
          onClick={handleLogout}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
);
}