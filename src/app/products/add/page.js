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

    if (!title.trim() || !price || !category.trim()) {
      setError("Please fill all required fields.");
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
      };

      const data = await addProduct(product);

      console.log("Product added:", data);

      router.push("/products");
    } catch (error) {
      console.error("Failed to add product:", error);
      setError("Failed to add product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main>
        <h1>Add Product</h1>

        {error && <p>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Title *</label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product title"
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
            />
          </div>

          <div>
            <label>Category *</label>

            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Product category"
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
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </main>
    </div>
  );
}