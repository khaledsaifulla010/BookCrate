import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  useDeleteBookMutation,
  useGetBooksQuery,
} from "../../store/api/booksApi";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";


import { Badge } from "../../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import type { Book, Genre } from "../../store/types/book";


const GENRES: Genre[] = [
  "FICTION",
  "NON_FICTION",
  "SCIENCE",
  "HISTORY",
  "BIOGRAPHY",
  "FANTASY",
];

export default function BooksList() {
  const [filter, setFilter] = useState<Genre | "">("");
  const [limit, setLimit] = useState<number>(50);

  const {
    data: books = [],
    isLoading,
    isError,
    refetch,
  } = useGetBooksQuery({
    filter: filter || undefined,
    sortBy: "createdAt",
    sort: "desc",
    limit,
  }) as {
    data: Book[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  };

  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();
  const navigate = useNavigate();

  const onDelete = async (id: string, title: string) => {
    try {
      await deleteBook(id).unwrap();
      toast.success(`Deleted "${title}"`);
    } catch (err: unknown) {
      if (typeof err === "object" && err && "data" in err) {
        toast.error(
          (err as { data?: { message?: string } }).data?.message ||
            "Failed to delete"
        );
      } else {
        toast.error("Failed to delete");
      }
    }
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Books</h1>
        <div className="flex items-center gap-2">
          {/* Genre Filter */}
          <Select
            value={filter || undefined} // undefined means nothing selected
            onValueChange={(val) => setFilter(val as Genre)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              {GENRES.map((g) => (
                <SelectItem key={g} value={g}>
                  {g.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Limit */}
          <Select
            value={String(limit)}
            onValueChange={(val) => setLimit(Number(val))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  Limit: {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="secondary" onClick={() => refetch()}>
            Refresh
          </Button>
          <Button onClick={() => navigate("/create-book")}>Add Book</Button>
        </div>
      </div>

      {/* Books Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Copies</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {isError && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-red-600"
                    >
                      Failed to load books.
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && books.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No books found.
                    </TableCell>
                  </TableRow>
                )}
                {books.map((b: Book) => (
                  <TableRow key={b._id}>
                    <TableCell>
                      <Link
                        className="underline underline-offset-2"
                        to={`/books/${b._id}`}
                      >
                        {b.title}
                      </Link>
                    </TableCell>
                    <TableCell>{b.author}</TableCell>
                    <TableCell>{b.genre.replace("_", " ")}</TableCell>
                    <TableCell>{b.isbn}</TableCell>
                    <TableCell>{b.copies}</TableCell>
                    <TableCell>
                      {b.available ? (
                        <Badge>Available</Badge>
                      ) : (
                        <Badge variant="destructive">Unavailable</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => navigate(`/edit-book/${b._id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => navigate(`/borrow/${b._id}`)}
                          disabled={!b.available || b.copies === 0}
                        >
                          Borrow
                        </Button>

                        {/* Delete with AlertDialog */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting}>
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Book</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{b.title}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(b._id, b.title)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
