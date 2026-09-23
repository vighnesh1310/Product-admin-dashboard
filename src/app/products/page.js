"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar";
import ProductList from "../../components/ProductList";
import { getProducts } from "../../services/productApi";

const PRODUCTS_PER_PAGE = 20;

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const skip = (page - 1) * PRODUCTS_PER_PAGE;

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

        const data = await getProducts(
        PRODUCTS_PER_PAGE,
        skip
      );

      setProducts(data.products);
      setTotal(data.total);
      } catch (error) {
        console.error("Failed to load products:", error);

        setError("Failed to load products.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [router, page]);

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
        <div>
          <button
            onClick={() => setPage((currentPage) => currentPage - 1)}
            disabled={page === 1 || isLoading}
          >
            Previous
          </button>

          <span>
            Page {page}
          </span>

          <button
            onClick={() => setPage((currentPage) => currentPage + 1)}
            disabled={
              page >= Math.ceil(total / PRODUCTS_PER_PAGE) ||
              isLoading
            }
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}