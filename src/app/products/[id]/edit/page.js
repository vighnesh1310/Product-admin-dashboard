"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "../../../../components/Navbar";
import {
  getProductById,
  updateProduct,
} from "../../../../services/productApi";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Protect page and load product
 useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.replace("/login");
    return;
  }

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Check locally added products first
      const addedProducts = JSON.parse(
        localStorage.getItem("addedProducts") || "[]"
      );

      const localProduct = addedProducts.find(
        (product) => String(product.id) === String(params.id)
      );

      if (localProduct) {
        setTitle(localProduct.title || "");
        setPrice(localProduct.price ?? "");
        setCategory(localProduct.category || "");
        setDescription(localProduct.description || "");
        return;
      }

      // Otherwise load product from API
      const data = await getProductById(params.id);

      // Apply locally saved update if available
      const updatedProducts = JSON.parse(
        localStorage.getItem("updatedProducts") || "{}"
      );

      const finalProduct =
        updatedProducts[params.id] || data;

      setTitle(finalProduct.title || "");
      setPrice(finalProduct.price ?? "");
      setCategory(finalProduct.category || "");
      setDescription(finalProduct.description || "");
    } catch (error) {
      console.error("Failed to load product:", error);

      if (error.response?.status === 404) {
        setError("Product not found.");
      } else {
        setError("Failed to load product.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  loadProduct();
}, [params.id, router]);
  // Protect against closing the browser with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirty) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [isDirty]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a product title.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Please enter a valid price greater than 0.");
      return;
    }

    if (!category.trim()) {
      setError("Please enter a category.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const product = {
        title: title.trim(),
        price: Number(price),
        category: category.trim(),
        description: description.trim(),
      };

      // Check if this is a locally added product
        const addedProducts = JSON.parse(
        localStorage.getItem("addedProducts") || "[]"
        );

        const localProductIndex = addedProducts.findIndex(
        (item) => String(item.id) === String(params.id)
        );

        let data;

        if (localProductIndex !== -1) {
        // Update locally added product
        const updatedLocalProduct = {
            ...addedProducts[localProductIndex],
            ...product,
        };

        addedProducts[localProductIndex] = updatedLocalProduct;

        localStorage.setItem(
            "addedProducts",
            JSON.stringify(addedProducts)
        );

        data = updatedLocalProduct;
        } else {
        // Update original API product
        data = await updateProduct(
            params.id,
            product
        );

        // Save API update locally
        const updatedProducts = JSON.parse(
            localStorage.getItem("updatedProducts") || "{}"
        );

        updatedProducts[params.id] = data;

        localStorage.setItem(
            "updatedProducts",
            JSON.stringify(updatedProducts)
        );
        }

        console.log("Product updated:", data);

        setIsDirty(false);

        router.push("/products");
    } catch (error) {
      console.error(
        "Failed to update product:",
        error
      );

      setError("Failed to update product.");
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-4 py-8 sm:px-6">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

            <p className="text-sm font-medium text-gray-600">
              Loading product...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        {/* Page Header */}
        <div className="mb-6">
          <button
                type="button"
                onClick={() => router.push("/products")}
                className="mb-4 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
                ← Back to Products
            </button>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Edit Product
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update the product information below
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title *
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Product title"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price *
            </label>

            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Product price"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category *
            </label>

            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Product category"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Product description"
              rows={5}
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/products")}
              disabled={isSaving}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}