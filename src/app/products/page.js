"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function ProductsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div>
      <Navbar />

      <main>
        <h1>Products</h1>
        <p>Welcome to the product dashboard.</p>
      </main>
    </div>
  );
}