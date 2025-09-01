import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home/Home";
import BooksList from "../Pages/Books/BooksList";
import BookDetails from "../Pages/Books/BookDetails";
import BookForm from "../Pages/Books/BookForm";
import BorrowForm from "../Pages/Borrow/BorrowForm";
import BorrowSummary from "../Pages/Borrow/BorrowSummary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <Home />,
        children: [
          { index: true, element: <Navigate to="/books" replace /> },
          { path: "/books", element: <BooksList /> },
          { path: "/books/:id", element: <BookDetails /> },
          { path: "/create-book", element: <BookForm mode="create" /> },
          { path: "/edit-book/:id", element: <BookForm mode="edit" /> },
          { path: "/borrow/:bookId", element: <BorrowForm /> },
          { path: "/borrow-summary", element: <BorrowSummary /> },
        ],
      },
    ],
  },
]);

export default router;
