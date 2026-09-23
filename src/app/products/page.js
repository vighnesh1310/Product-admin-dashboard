"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Navbar from "../../components/Navbar";
import ProductList from "../../components/ProductList";

import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
} from "../../services/productApi";

const PRODUCTS_PER_PAGE = 20;

const VALID_SORTS = ["", "price", "rating"];
const VALID_ORDERS = ["asc", "desc"];

const getValidPage = (value) => {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
};

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Get page from URL
  const [page, setPage] = useState(() =>
    getValidPage(searchParams.get("page"))
  );

  const [total, setTotal] = useState(0);

  // Get search from URL
  const [search, setSearch] = useState(
    () => searchParams.get("search") || ""
  );

  const [categories, setCategories] = useState([]);

  // Get category from URL
  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get("category") || ""
  );

  // Get sortBy from URL
  const [sortBy, setSortBy] = useState(() => {
    const value = searchParams.get("sortBy");

    return VALID_SORTS.includes(value) ? value : "";
  });

  // Get sort order from URL
  const [sortOrder, setSortOrder] = useState(() => {
    const value = searchParams.get("order");

    return VALID_ORDERS.includes(value) ? value : "asc";
  });

  const skip = (page - 1) * PRODUCTS_PER_PAGE;

  // --------------------------------
  // Load Products
  // --------------------------------

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(
      async () => {
        try {
          setIsLoading(true);
          setError("");

          let data;

          // Normal products
          if (search.trim() === "") {
            // All categories
            if (selectedCategory === "") {
              data = await getProducts(
                PRODUCTS_PER_PAGE,
                skip,
                sortBy,
                sortOrder
              );
            }

            // Selected category
            else {
              data = await getProductsByCategory(
                selectedCategory,
                PRODUCTS_PER_PAGE,
                skip,
                sortBy,
                sortOrder
              );
            }
          }

          // Search products
          else {
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
          // Ignore cancelled search requests
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
      },
      search.trim() === "" ? 0 : 500
    );

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    router,
    page,
    search,
    selectedCategory,
    sortBy,
    sortOrder,
    skip,
  ]);

  // --------------------------------
  // Load Categories
  // --------------------------------

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );
      }
    };

    loadCategories();
  }, []);

  // --------------------------------
  // Reset page when filters change
  // --------------------------------

  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedCategory,
    sortBy,
    sortOrder,
  ]);

  // --------------------------------
  // Sync State with URL
  // --------------------------------

  useEffect(() => {
    const params = new URLSearchParams();

    if (page > 1) {
      params.set("page", page);
    }

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (selectedCategory) {
      params.set(
        "category",
        selectedCategory
      );
    }

    if (sortBy) {
      params.set("sortBy", sortBy);
      params.set("order", sortOrder);
    }

    const queryString = params.toString();

    router.replace(
      queryString
        ? `/products?${queryString}`
        : "/products"
    );
  }, [
    page,
    search,
    selectedCategory,
    sortBy,
    sortOrder,
    router,
  ]);

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div>
      <Navbar />

      <main>
        <h1>Products</h1>

        {/* Search */}

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* Category */}

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
        >
          <option value="">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category.slug}
              value={category.slug}
            >
              {category.name}
            </option>
          ))}
        </select>

        {/* Sort By */}

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
        >
          <option value="">
            Sort By
          </option>

          <option value="price">
            Price
          </option>

          <option value="rating">
            Rating
          </option>
        </select>

        {/* Sort Order */}

        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value)
          }
          disabled={!sortBy}
        >
          <option value="asc">
            Ascending
          </option>

          <option value="desc">
            Descending
          </option>
        </select>

        {/* Loading */}

        {isLoading && (
          <p>Loading products...</p>
        )}

        {/* Error */}

        {error && (
          <p>{error}</p>
        )}

        {/* Products */}

        {!isLoading &&
          !error &&
          products.length > 0 && (
            <ProductList
              products={products}
            />
          )}

        {/* Empty State */}

        {!isLoading &&
          !error &&
          products.length === 0 && (
            <p>
              No products found.
            </p>
          )}

        {/* Pagination */}

        <div>
          <button
            onClick={() =>
              setPage(
                (currentPage) =>
                  currentPage - 1
              )
            }
            disabled={
              page === 1 ||
              isLoading
            }
          >
            Previous
          </button>

          <span>
            {" "}
            Page {page}{" "}
          </span>

          <button
            onClick={() =>
              setPage(
                (currentPage) =>
                  currentPage + 1
              )
            }
            disabled={
              page >=
                Math.ceil(
                  total /
                    PRODUCTS_PER_PAGE
                ) ||
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