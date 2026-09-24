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

  // Protect page
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

        const data = await getProductById(params.id);

        setTitle(data.title || "");
        setPrice(data.price ?? "");
        setCategory(data.category || "");
        setDescription(data.description || "");
      } catch (error) {
        console.error(
          "Failed to load product:",
          error
        );

        setError("Failed to load product.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params.id, router]);

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

      const data = await updateProduct(
        params.id,
        product
        );

        console.log("Product updated:", data);

        // Save updated product locally
        const updatedProducts = JSON.parse(
        localStorage.getItem("updatedProducts") || "{}"
        );

        updatedProducts[params.id] = data;

        localStorage.setItem(
        "updatedProducts",
        JSON.stringify(updatedProducts)
        );

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

  if (isLoading) {
    return <p>Loading product...</p>;
  }

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

      <main>
        <h1>Edit Product</h1>

        {error && <p>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Title *</label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          </div>

          <div>
            <label>Price *</label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
            />
          </div>

          <div>
            <label>Category *</label>

            <input
              type="text"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            />
          </div>

          <div>
            <label>Description</label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
          >
            {isSaving
              ? "Updating..."
              : "Update Product"}
          </button>
        </form>
      </main>
    </div>
  );
}