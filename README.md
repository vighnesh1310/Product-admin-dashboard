# Product Admin Dashboard

A responsive product management dashboard built with Next.js, React, and Tailwind CSS.

## Live Demo

https://product-admin-dashboard-gold-delta.vercel.app/

## GitHub Repository

https://github.com/vighnesh1310/Product-admin-dashboard

## Features

- User login and protected product pages
- Product listing with pagination
- Responsive desktop table and mobile cards
- Debounced product search
- Search race-condition protection
- Category filtering
- Price and rating sorting
- URL-synchronized filters and pagination
- Product details and reviews
- Add, edit, and delete products
- Loading, error, and empty states
- Form validation
- Unsaved changes protection
- Logout functionality

## Technologies Used

- Next.js
- React
- JavaScript
- Tailwind CSS
- Axios
- DummyJSON API
- Git
- GitHub
- Vercel

## API

The project uses DummyJSON for authentication and product data.

### Authentication

```text
POST /auth/login
```

### Products

```text
GET /products
GET /products/search
GET /products/categories
GET /products/category/{category}
GET /products/{id}
POST /products/add
PUT /products/{id}
DELETE /products/{id}
```

## Login Credentials

```text
Username: emilys
Password: emilyspass
```

## Application Flow

```text
Login
  |
  v
Products Dashboard
  |
  +-- Search Products
  +-- Filter by Category
  +-- Sort Products
  +-- Pagination
  |
  +-- View Product
  |     +-- Product Details
  |
  +-- Add Product
  +-- Edit Product
  +-- Delete Product
  |
  v
Logout
```

## Project Structure

```text
Product-admin-dashboard/
|
+-- public/
|
+-- src/
|   |
|   +-- app/
|   |   |
|   |   +-- login/
|   |   |   +-- page.js
|   |   |
|   |   +-- products/
|   |       |
|   |       +-- [id]/
|   |       |   +-- edit/
|   |       |       +-- page.js
|   |       |   +-- page.js
|   |       |
|   |       +-- add/
|   |       |   +-- page.js
|   |       |
|   |       +-- page.js
|   |
|   +-- components/
|   |   +-- Navbar.jsx
|   |   +-- ProductList.jsx
|   |
|   +-- services/
|       +-- axios.js
|       +-- authApi.js
|       +-- productApi.js
|
+-- .gitignore
+-- package.json
+-- package-lock.json
+-- README.md
```

## Main Pages

### Login

```text
/login
```

Used for authentication. After successful login, the user is redirected to `/products`.

### Products

```text
/products
```

Main product management dashboard.

### Add Product

```text
/products/add
```

Used to create a new product.

### Product Details

```text
/products/{id}
```

Displays detailed information about a selected product.

### Edit Product

```text
/products/{id}/edit
```

Used to update product information.

## URL Query Parameters

The products page keeps filters and pagination in the URL.

```text
/products?page=2
/products?search=phone
/products?category=beauty
/products?sortBy=price&order=asc
/products?page=2&category=beauty&sortBy=price&order=desc
```

Invalid page, sorting, or order values are handled safely.

## CRUD Operations

### Create

Users can add a product using the Add Product form. The form validates title, price, category, and image URL.

### Read

Products are loaded from DummyJSON and displayed in the dashboard. Users can also open a product details page.

### Update

Users can edit title, price, category, and description.

### Delete

Users can delete products after confirming the delete action.

## Local Product Handling

DummyJSON provides simulated product write operations. The application therefore uses browser `localStorage` to maintain locally added, updated, and deleted product information.

The application uses:

```text
token
addedProducts
updatedProducts
deletedProducts
```

## Search Race Condition Handling

Search uses debouncing to reduce unnecessary API requests.

An `AbortController` is used to cancel an older search request when a newer search starts. This prevents an older API response from replacing the latest search results.

## Authentication Protection

Product pages check whether an authentication token exists in `localStorage`.

If the user is not authenticated, `/products` redirects to `/login`.

After logout, the token is removed and the user is redirected to the login page.

## Responsive Design

### Desktop

Products are displayed in a table containing:

```text
Image
Title
Category
Price
Rating
Stock
Actions
```

### Mobile

Products are displayed as cards containing:

```text
Image
Title
Category
Price
Rating
Stock
View
Edit
Delete
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/vighnesh1310/Product-admin-dashboard.git
```

### 2. Open the project

```bash
cd Product-admin-dashboard
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

```text
http://localhost:3000
```

## Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Deployment

The application is deployed using Vercel.

Live application:

https://product-admin-dashboard-gold-delta.vercel.app/

The project is connected to GitHub and deployed through Vercel. Changes pushed to the `main` branch can trigger a new deployment.

## Testing Checklist

- [x] Login with valid credentials
- [x] Invalid login handling
- [x] Login loading state
- [x] Protected product route
- [x] Logout
- [x] Product listing
- [x] Pagination
- [x] Product search
- [x] Search debounce
- [x] Search race-condition protection
- [x] Category filtering
- [x] Price sorting
- [x] Rating sorting
- [x] URL filter synchronization
- [x] Invalid URL parameter handling
- [x] Product details
- [x] Product reviews
- [x] Add product
- [x] Edit product
- [x] Delete product
- [x] Responsive product layout
- [x] Loading state
- [x] Error handling
- [x] Empty state
- [x] Unsaved form protection
- [x] Production build

## Future Improvements

- Dashboard statistics and analytics
- Better toast notifications
- Advanced product filtering
- Bulk product operations
- User profile management
- Persistent backend database for CRUD operations
- Role-based access control
- Product image upload
- Automated testing

## Author

**Vighnesh Kadam**

GitHub: https://github.com/vighnesh1310

## License

This project was created as a product admin dashboard assignment and for learning and demonstration purposes.
