"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar";
import ProductList from "../../components/ProductList";
import { getProducts } from "../../services/productApi";

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getProducts(10, 0);

        setProducts(data.products);
      } catch (error) {
        console.error("Failed to load products:", error);

        setError("Failed to load products.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [router]);

  return (
    <div>
      <Navbar />

      <main>
        <h1>Products</h1>

        {isLoading && <p>Loading products...</p>}

        {error && <p>{error}</p>}

        {!isLoading && !error && (
          <ProductList products={products} />
        )}
      </main>
    </div>
  );
}