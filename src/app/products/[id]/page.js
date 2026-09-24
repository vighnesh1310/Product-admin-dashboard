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

      <main>
        <h1>{product.title}</h1>

        <div>
        {/* Main Image */}
        <img
            src={selectedImage}
            alt={product.title}
            width="400"
        />

        {/* Image Gallery */}
        <div>
            {product.images?.map((image, index) => (
            <button
                key={index}
                onClick={() => setSelectedImage(image)}
            >
                <img
                src={image}
                alt={`${product.title} ${index + 1}`}
                width="80"
                />
            </button>
            ))}
        </div>
        </div>

        <div>
            <h1>{product.title}</h1>

            <p>Brand: {product.brand || "N/A"}</p>

            <p>Category: {product.category}</p>

            <p>Price: ${product.price}</p>

            <p>
                Rating: ⭐ {product.rating}
            </p>

            <p>
                Stock: {product.stock}
            </p>

            <p>
                Discount: {product.discountPercentage}%
            </p>

            <h2>Description</h2>

            <p>{product.description}</p>
            <h2>Reviews</h2>

                {product.reviews && product.reviews.length > 0 ? (
                <div>
                    {product.reviews.map((review, index) => (
                    <div key={index}>
                        <p>
                        <strong>{review.reviewerName}</strong>
                        </p>

                        <p>
                        Rating: ⭐ {review.rating}
                        </p>

                        <p>{review.comment}</p>

                        <p>
                        Date:{" "}
                        {new Date(
                            review.date
                        ).toLocaleDateString()}
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