"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar";
import ProductList from "../../components/ProductList";
import { getProducts, searchProducts,  getCategories, } from "../../services/productApi";

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

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

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
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");

        const skip = (page - 1) * PRODUCTS_PER_PAGE;

        let data;

        if (search.trim() === "") {
          data = await getProducts(
            PRODUCTS_PER_PAGE,
            skip
          );
        } else {
          data = await searchProducts(
            search.trim(),
            PRODUCTS_PER_PAGE,
            skip,
            controller.signal
          );
        }

        setProducts(data.products);
        setTotal(data.total);
      } catch (error) {
        if (
          error.name === "CanceledError" ||
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Failed to load products:", error);
        setError("Failed to load products.");
      } finally {
        setIsLoading(false);
      }
    }, search.trim() === "" ? 0 : 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [router, page, search]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
  }, []);

  return (
    <div>
      <Navbar />

      <main>
        <h1>Products</h1>

        {isLoading && <p>Loading products...</p>}

        {error && <p>{error}</p>}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
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