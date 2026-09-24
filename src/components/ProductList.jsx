"use client";

import { useRouter } from "next/navigation";
import { deleteProduct } from "../services/productApi";

export default function ProductList({ products, onProductDeleted, }) {
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

       // router.refresh();
        onProductDeleted();
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
      <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[900px] text-left">
          <thead>
           <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Image</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Title</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Category</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Price</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Rating</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 transition hover:bg-gray-50"
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
                        className="h-14 w-14 rounded-lg border border-gray-200 bg-gray-50 object-cover"
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

                <td className="px-4 py-4 font-medium text-gray-900">
                  ${product.price}
                </td>

                <td className="px-4 py-4">
                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700">
                    ⭐ {product.rating}
                </span>
                </td>

                <td className="px-4 py-4">
                <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    product.stock > 0
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                >
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>

                <div className="mt-3 flex flex-wrap gap-2">
                    <button
                    onClick={() =>
                        router.push(`/products/${product.id}`)
                    }
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                    View
                    </button>
                    <button
                    onClick={() =>
                        window.location.href = `/products/${product.id}/edit`
                    }
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
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
      <div className="grid gap-4 sm:grid-cols-2 md:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <button
            onClick={() =>
                router.push(`/products/${product.id}`)
            }
            >
            <img
                src={product.thumbnail}
                alt={product.title}
                className="h-48 w-full bg-gray-50 object-contain p-4"
            />
            </button>

            <h3 className="px-4 pt-4 text-lg font-semibold text-gray-900">
            <button
                onClick={() =>
                router.push(`/products/${product.id}`)
                }
            >
                {product.title}
            </button>
            </h3>

            <div className="space-y-2 px-4 pb-4 pt-3">
            <p className="text-sm text-gray-500">
                Category: <span className="font-medium text-gray-700">{product.category}</span>
            </p>

            <p className="text-sm text-gray-700">
                Price: <span className="font-semibold">${product.price}</span>
            </p>

            <p className="text-sm">
                Rating:
                <span className="ml-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                ⭐ {product.rating}
                </span>
            </p>

            <p className="text-sm">
                Stock:
                <span
                className={`ml-1 font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
                >
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
            </p>
            </div>
            <div className="flex gap-2 pt-2">
            <button
                onClick={() => router.push(`/products/${product.id}`)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                View
            </button>

            <button
                onClick={() =>
                window.location.href = `/products/${product.id}/edit`
                }
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Edit
            </button>

            <button
                onClick={() => handleDelete(product.id)}
                className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
                Delete
            </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}