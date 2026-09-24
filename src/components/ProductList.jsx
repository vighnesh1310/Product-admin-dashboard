"use client";

import { useRouter } from "next/navigation";
import { deleteProduct } from "../services/productApi";

export default function ProductList({ products }) {
    const router = useRouter();
    
    const handleDelete = async (productId) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
        return;
    }

    try {
        // Check locally added products
        const addedProducts = JSON.parse(
        localStorage.getItem("addedProducts") || "[]"
        );

        const isLocalProduct = addedProducts.some(
        (product) => product.id === productId
        );

        // If it is a locally added product,
        // remove it directly from localStorage
        if (isLocalProduct) {
        const remainingProducts = addedProducts.filter(
            (product) => product.id !== productId
        );

        localStorage.setItem(
            "addedProducts",
            JSON.stringify(remainingProducts)
        );

        router.refresh();
        return;
        }

        // Otherwise delete the original API product
        await deleteProduct(productId);

        // Save deleted product ID locally
        const deletedProducts = JSON.parse(
        localStorage.getItem("deletedProducts") || "[]"
        );

        if (!deletedProducts.includes(productId)) {
        deletedProducts.push(productId);
        }

        localStorage.setItem(
        "deletedProducts",
        JSON.stringify(deletedProducts)
        );

        router.refresh();
    } catch (error) {
        console.error(
        "Failed to delete product:",
        error
        );

        alert("Failed to delete product.");
    }
    };

  return (
    <div className="w-full">

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">
                  <button
                    onClick={() =>
                        router.push(`/products/${product.id}`)
                    }
                    >
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-16 w-16 rounded object-cover"
                    />
                   </button>
                </td>

                <td className="p-4 font-medium">
                <button
                    onClick={() =>
                    router.push(`/products/${product.id}`)
                    }
                >
                    {product.title}
                </button>
                </td>

                <td className="p-4">
                  {product.category}
                </td>

                <td className="p-4">
                  ${product.price}
                </td>

                <td className="p-4">
                  ⭐ {product.rating}
                </td>

                <td className="p-4">
                {product.stock}

                <div className="mt-2">
                    <button
                    onClick={() =>
                        router.push(`/products/${product.id}`)
                    }
                    >
                    View
                    </button>
                    <button
                    onClick={() =>
                        window.location.href = `/products/${product.id}/edit`
                    }
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => handleDelete(product.id)}
                    >
                    Delete
                    </button>
                </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border p-4 shadow-sm"
          >
            <button
            onClick={() =>
                router.push(`/products/${product.id}`)
            }
            >
            <img
                src={product.thumbnail}
                alt={product.title}
                className="mb-3 h-40 w-full rounded object-cover"
            />
            </button>

            <h3 className="mb-2 text-lg font-semibold">
            <button
                onClick={() =>
                router.push(`/products/${product.id}`)
                }
            >
                {product.title}
            </button>
            </h3>

            <p className="text-sm text-gray-600">
              Category: {product.category}
            </p>

            <p className="mt-1">
              Price: ${product.price}
            </p>

            <p className="mt-1">
              Rating: ⭐ {product.rating}
            </p>

            <p className="mt-1">
            Stock: {product.stock}
            </p>
            <button
            onClick={() =>
                router.push(`/products/${product.id}`)
            }
            >
            View
            </button>
            <button
            onClick={() =>
                window.location.href = `/products/${product.id}/edit`
            }
            >
            Edit
            </button>
            <button
            onClick={() => handleDelete(product.id)}
            >
            Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}