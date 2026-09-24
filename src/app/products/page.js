"use client";

import { useEffect, useState, Suspense } from "react";
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

function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [retryCount, setRetryCount] = useState(0);

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

          //setProducts(data.products);
          //setTotal(data.total);

          // Get locally added products
        const addedProducts = JSON.parse(
          localStorage.getItem("addedProducts") || "[]"
        );

        // Get locally updated products
        const updatedProducts = JSON.parse(
          localStorage.getItem("updatedProducts") || "{}"
        );

        // Apply local updates
        data.products = data.products.map((product) => {
          return updatedProducts[product.id] || product;
        });

        const deletedProducts = JSON.parse(
          localStorage.getItem("deletedProducts") || "[]"
        );

        data.products = data.products.filter(
          (product) => !deletedProducts.includes(product.id)
        );

       

        const deletedCount = deletedProducts.length;

        const totalItems = Math.max(
          0,
          data.total - deletedCount + addedProducts.length
        );

      //setTotal(totalItems);;

      setTotal(totalItems);
      if (page === 1 && search.trim() === "" && selectedCategory === "") {
        const remainingSlots = PRODUCTS_PER_PAGE - data.products.length;

        if (remainingSlots > 0) {
          data.products = [
            ...addedProducts.slice(0, remainingSlots),
            ...data.products,
          ];
        }
      }
      const totalPages = Math.max(
        1,
        Math.ceil(totalItems / PRODUCTS_PER_PAGE)
      );

        // If requested page is beyond the last page,
        // move to the last available page
        if (page > totalPages) {
          setPage(totalPages);
          return;
        }

        setProducts(data.products);

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
    retryCount,
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
    params.set("category", selectedCategory);
  }

  if (sortBy) {
    params.set("sortBy", sortBy);
    params.set("order", sortOrder);
  }

  const queryString = params.toString();
  const newUrl = queryString
    ? `/products?${queryString}`
    : "/products";

  // Don't navigate if URL is already correct
  const currentQuery = searchParams.toString();
  const currentUrl = currentQuery
    ? `/products?${currentQuery}`
    : "/products";

  if (newUrl !== currentUrl) {
    router.replace(newUrl);
  }
}, [
  page,
  search,
  selectedCategory,
  sortBy,
  sortOrder,
  router,
  searchParams,
]);

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div>
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Products
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and explore your products
            </p>
          </div>

          <button
            onClick={() => router.push("/products/add")}
           className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black"
          >
            + Add Product
          </button>
        </div>
        {/* Search */}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
          />
        </div>
        {/* Category */}
       <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
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
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
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
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
          disabled={!sortBy}
        >
          <option value="asc">
            Ascending
          </option>

          <option value="desc">
            Descending
          </option>
        </select>
        </div>
        <button
          onClick={() => {
            setSearch("");
            setSelectedCategory("");
            setSortBy("");
            setSortOrder("asc");
            setPage(1);
          }}
         className="mb-5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          Clear Filters
        </button>

        {/* Loading */}

        {isLoading && (
          <div>
            <p>Loading products...</p>
          </div>
        )}

        {/* Error */}

        {error && (
          <div>
            <p>{error}</p>

            <button
              onClick={() => setRetryCount((count) => count + 1)}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products */}
        {!isLoading &&
          !error &&
          products.length > 0 && (
            <ProductList
              products={products}
              onProductDeleted={() => setRetryCount((count) => count + 1)}
            />
          )}
        
          {/* Empty State */}

        {!isLoading &&
          !error &&
          products.length === 0 && (
            
            <div>
              <h2>No products found</h2>

              <p>
                Try changing your search or filters.
              </p>
            </div>
          )}

        

        {/* Pagination */}

        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-600">
            {total > 0
              ? `Showing ${
                  (page - 1) * PRODUCTS_PER_PAGE + 1
                }-${Math.min(
                  page * PRODUCTS_PER_PAGE,
                  total
                )} of ${total} products`
              : "No products"}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setPage((currentPage) => currentPage - 1)
              }
              disabled={page === 1 || isLoading}
              className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm font-medium">
              Page {page} of{" "}
              {Math.max(
                1,
                Math.ceil(total / PRODUCTS_PER_PAGE)
              )}
            </span>

            <button
              onClick={() =>
                setPage((currentPage) => currentPage + 1)
              }
              disabled={
                page >=
                  Math.ceil(total / PRODUCTS_PER_PAGE) ||
                isLoading
              }
              className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
export default function ProductsPageWrapper() {
  return (
    <Suspense fallback={<p>Loading products...</p>}>
      <ProductsPage />
    </Suspense>
  );
}