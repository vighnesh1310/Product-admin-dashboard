"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "../../../components/Navbar";
import { getProductById } from "../../../services/productApi";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

        setProduct(data);
        setSelectedImage(data.images?.[0] || data.thumbnail);
      } catch (error) {
        console.error("Failed to load product:", error);
        setError("Failed to load product.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params.id, router]);

  if (isLoading) {
    return <p>Loading product...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div>
      <Navbar />

      <main className="mx-auto max-w-6xl p-6">
        <button
            onClick={() => router.push("/products")}
            className="mb-6 rounded border px-4 py-2 hover:bg-gray-100"
        >
            ← Back to Products
        </button>

        <div className="grid gap-8 md:grid-cols-2">
            {/* Image Section */}
            <div>
            {/* Main image */}
            <img
                src={selectedImage}
                alt={product.title}
                className="h-96 w-full rounded-lg object-contain border"
            />

            {/* Gallery */}
            <div className="mt-4 flex gap-3 overflow-x-auto">
                {product.images?.map((image, index) => (
                <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                >
                    <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="h-20 w-20 rounded border object-cover"
                    />
                </button>
                ))}
            </div>
            </div>

            {/* Product Information */}
            <div>
            <h1 className="text-3xl font-bold">
                {product.title}
            </h1>

            <p className="mt-2 text-gray-600">
                Brand: {product.brand || "N/A"}
            </p>

            <p className="mt-2">
                Category: {product.category}
            </p>

            <p className="mt-4 text-2xl font-bold">
                ${product.price}
            </p>

            <p className="mt-2">
                ⭐ {product.rating}
            </p>

            <p className="mt-2">
                Stock: {product.stock}
            </p>

            <p className="mt-2">
                Discount: {product.discountPercentage}%
            </p>

            <div className="mt-6">
                <h2 className="text-xl font-semibold">
                Description
                </h2>

                <p className="mt-2 text-gray-600">
                {product.description}
                </p>
            </div>
            </div>
                </div>

        {/* Reviews */}
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-bold">
            Reviews
          </h2>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="grid gap-4">
              {product.reviews.map((review, index) => (
                <div
                  key={index}
                  className="rounded-lg border p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {review.reviewerName}
                    </h3>

                    <span>
                      ⭐ {review.rating}
                    </span>
                  </div>

                  <p className="mt-2 text-gray-700">
                    {review.comment}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      </main>
    </div>
  );
}