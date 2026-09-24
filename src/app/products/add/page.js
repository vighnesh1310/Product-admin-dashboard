"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../../components/Navbar";
import { addProduct } from "../../../services/productApi";

export default function AddProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  
  const [isDirty, setIsDirty] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
        router.replace("/login");
    }
    }, [router]);

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

    if (!image.trim()) {
    setError("Please enter an image URL.");
    return;
    }

    try {
    new URL(image.trim());
    } catch {
    setError("Please enter a valid image URL.");
    return;
    }

    try {
      setIsLoading(true);
      setError("");

      const product = {
        title: title.trim(),
        price: Number(price),
        category: category.trim(),
        description: description.trim(),
        thumbnail: image.trim(),
        images: image.trim() ? [image.trim()] : [],
        };

      const data = await addProduct(product);

        console.log("Product added:", data);

        // Save added product locally
        const addedProducts = JSON.parse(
        localStorage.getItem("addedProducts") || "[]"
        );

        addedProducts.push(data);

        localStorage.setItem(
        "addedProducts",
        JSON.stringify(addedProducts)
        );
        setIsDirty(false);
        router.push("/products");
    } catch (error) {
      console.error("Failed to add product:", error);
      setError("Failed to add product.");
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div>
      <Navbar />

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Add Product
        </h1>

        <p className="mt-1 text-sm text-gray-500">
            Add a new product to your inventory
        </p>
        </div>

        {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
        </div>
        )}

        <form onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Title *</label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product title"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div>
            <label>Price *</label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Product price"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div>
            <label>Category *</label>

            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Product category"
               className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div>
            <label>Image URL</label>

            <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/product.jpg"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"

            />
          </div>

          <div>
            <label>Description</label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Product description"
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50">
            {isLoading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </main>
    </div>
  );
}