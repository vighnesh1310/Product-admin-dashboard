"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <button
          onClick={() => router.push("/products")}
          className="text-lg font-bold tracking-tight text-gray-900 transition hover:text-gray-600 sm:text-xl"
        >
          Product Manager
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => router.push("/products")}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            Products
          </button>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-900 hover:text-white sm:px-4"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}