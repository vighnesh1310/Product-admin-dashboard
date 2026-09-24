"use client";

export default function ProductList({ products }) {
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
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-16 w-16 rounded object-cover"
                  />
                </td>

                <td className="p-4 font-medium">
                  {product.title}
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
            <img
              src={product.thumbnail}
              alt={product.title}
              className="mb-3 h-40 w-full rounded object-cover"
            />

            <h3 className="mb-2 text-lg font-semibold">
              {product.title}
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
          </div>
        ))}
      </div>

    </div>
  );
}