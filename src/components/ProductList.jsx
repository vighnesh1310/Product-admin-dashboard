"use client";

export default function ProductList({ products }) {
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <img
            src={product.thumbnail}
            alt={product.title}
            width="80"
          />

          <h3>{product.title}</h3>

          <p>Category: {product.category}</p>

          <p>Price: ${product.price}</p>

          <p>Rating: {product.rating}</p>

          <p>Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}