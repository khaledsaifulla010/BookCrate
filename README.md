# 📚 BookCrate - Library Management System

### BookCrate is a Library Management System **SPA** built using **React**, **TypeScript**, **Redux Toolkit (RTK Query)**, **Tailwind CSS**, and **shadcn/ui**. This client consumes the server API to manage books, borrowing operations, and presents a clean, responsive UI with validation, filtering, and aggregated reporting.

---

## 📚 Project Overview

### This Library Management System **Client** enables users to browse, create, update, delete, and borrow books. All routes are **public** (no authentication). UX is built with shadcn/ui components and Tailwind CSS. Data access is handled with **RTK Query**, ensuring a predictable, type-safe, and performant data layer.

---

## 🚀 Features

- 📖 View all books in a professional **table UI**
- ✏️ Create and edit books with **type-safe forms** (React Hook Form + Zod)
- 🗑️ Delete books with **optimistic UI** and toasts
- 🔍 Filter, sort, and quick **search** by title/author/ISBN
- 🧾 Borrow books with **stock validation** (`quantity ≤ copies`)
- ⛔ When `copies === 0` a book is automatically marked **Unavailable**
- 📈 Aggregated **Borrow Summary** by book (Title, ISBN, Total Quantity)
- 📱 **Responsive** design; **centered spinner** for loading states
- 🌐 **CORS-free** production via same-origin API calls and Vercel rewrites

---

## 🧱 Technologies Used

- **React 18**, **TypeScript**
- **Redux Toolkit** + **RTK Query**
- **Tailwind CSS**, **shadcn/ui**, **lucide-react**
- **React Hook Form** + **Zod**
- **Vite** (dev/build), **Vercel** (deploy)

---

## 📌 API Endpoints Summary

> The client uses RTK Query hooks that map to backend endpoints (consumed via `/api/*`).

### Frontend Data Hooks (RTK Query)

| Hook / Service               | Method | Path             | Description                                |
| ---------------------------- | ------ | ---------------- | ------------------------------------------ |
| `useGetBooksQuery(params?)`  | GET    | `/api/books`     | List books with optional filter/sort/limit |
| `useGetBookQuery(id)`        | GET    | `/api/books/:id` | Fetch one book                             |
| `useCreateBookMutation()`    | POST   | `/api/books`     | Create a book                              |
| `useUpdateBookMutation()`    | PUT    | `/api/books/:id` | Update a book                              |
| `useDeleteBookMutation()`    | DELETE | `/api/books/:id` | Delete a book (optimistic UI)              |
| `useCreateBorrowMutation()`  | POST   | `/api/borrow`    | Borrow a book; decrements available copies |
| `useGetBorrowSummaryQuery()` | GET    | `/api/borrow`    | Aggregated borrow summary per book         |

### Backend Endpoints (Consumed)

| Method | Endpoint             | Description                                                      |
| -----: | -------------------- | ---------------------------------------------------------------- |
|    GET | `/api/books`         | Get all books (filter: `filter`, sort: `sortBy`,`sort`, `limit`) |
|    GET | `/api/books/:bookId` | Get a single book by ID                                          |
|   POST | `/api/books`         | Create a new book                                                |
|    PUT | `/api/books/:bookId` | Update an existing book                                          |
| DELETE | `/api/books/:bookId` | Delete a book                                                    |
|   POST | `/api/borrow`        | Create a borrow record (validates stock)                         |
|    GET | `/api/borrow`        | Get aggregated borrow summary                                    |

---

## 🧰 Prerequisites

- **Node.js ≥ 18.x**
- A running **backend API** exposing the endpoints above (local or hosted)

---

## ⚙️ Configuration

- **Local Development**: Vite dev server proxies `/api/*` to your backend (configure in `vite.config.ts`).
- **Production (Vercel)**: The app calls **same-origin** `/api/*`. A `vercel.json` rewrite forwards these to your backend (server-side), so the browser never makes cross-origin requests (no CORS).

**No `.env` is required** for the client by default.  
If you previously used `VITE_API_URL`, remove it to keep same-origin calls.

---

## 🛠️ Installation Steps

```bash
# 1) Clone the repository
git clone https://github.com/khaledsaifulla010/BookCrate.git
cd BookCrate

# 2) Install dependencies
npm install

# 3) Run locally (Vite dev server)
npm run dev

# 4) Build for production
npm run build

# 5) Preview the production build locally
npm run preview
```

<p align="center"><strong>✅ Done with passion and precision by **Khaled Saifulla** .</strong></p>
