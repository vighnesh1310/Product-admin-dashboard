"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar";
import ProductList from "../../components/ProductList";
import { getProducts, searchProducts } from "../../services/productApi";

const PRODUCTS_PER_PAGE = 20;

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const skip = (page - 1) * PRODUCTS_PER_PAGE;

  const [search, setSearch] = useState("");

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
  
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");

        if (search.trim() === "") {
          const data = await getProducts(
            PRODUCTS_PER_PAGE,
            0
          );

          setProducts(data.products);
          setTotal(data.total);
          setPage(1);

          return;
        }

        const data = await searchProducts(
          search,
          PRODUCTS_PER_PAGE,
          0
        );

        setProducts(data.products);
        setTotal(data.total);
        setPage(1);
      } catch (error) {
        console.error("Search failed:", error);
        setError("Failed to search products.");
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <div>
      <Navbar />

      <main>
        <h1>Products</h1>

        {isLoading && <p>Loading products...</p>}

        {error && <p>{error}</p>}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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