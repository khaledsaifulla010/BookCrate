import { Link, useNavigate } from "react-router-dom";
import {
  useDeleteBookMutation,
  useGetBooksQuery,
} from "../../store/api/booksApi";
import { Button } from "../../components/ui/button";

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

import { useState, useMemo } from "react";
import type { Genre } from "../../store/types/book";
import { ArrowUpDown, Plus, Trash2, Pencil, Eye, Hand } from "lucide-react";
import toast from "react-hot-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";

export default function BooksList() {
  const [genre, setGenre] = useState<Genre | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"createdAt" | "title" | "author">(
    "createdAt"
  );
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState<number>(20);
  const [search, setSearch] = useState("");

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useGetBooksQuery({
    filter: genre === "ALL" ? undefined : genre,
    sortBy,
    sort,
    limit,
  });

  const navigate = useNavigate();
  const [deleteBook] = useDeleteBookMutation();

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q)
    );
  }, [data, search]);

  if (isLoading) return <div>Loading books...</div>;
  if (isError) return <div className="text-red-600">Failed to load books.</div>;

  const doDelete = async (id: string) => {
    const p = deleteBook(id).unwrap();
    toast.promise(p, {
      loading: "Deleting book...",
      success: "Book deleted",
      error: "Delete failed",
    });
    try {
      await p;
    } finally {
      refetch();
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="text-2xl font-semibold">Books</div>
        <div className="flex flex-1 md:flex-none gap-2">
          {/* Search */}
          <Input
            placeholder="Search by title, author, ISBN"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-72"
          />

          {/* Genre Filter */}
          <Select
            value={genre}
            onValueChange={(v) => setGenre(v as Genre | "ALL")}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All genres</SelectItem>
              <SelectItem value="FICTION">Fiction</SelectItem>
              <SelectItem value="NON_FICTION">Non-fiction</SelectItem>
              <SelectItem value="SCIENCE">Science</SelectItem>
              <SelectItem value="HISTORY">History</SelectItem>
              <SelectItem value="BIOGRAPHY">Biography</SelectItem>
              <SelectItem value="FANTASY">Fantasy</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Button
            variant="secondary"
            onClick={() => setSort((s) => (s === "asc" ? "desc" : "asc"))}
            className="gap-2"
            title="Toggle sort order"
          >
            <ArrowUpDown size={16} /> {sort.toUpperCase()}
          </Button>

          {/* Sort By */}
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as typeof sortBy)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="author">Author</SelectItem>
            </SelectContent>
          </Select>

          {/* Limit */}
          <Select
            value={String(limit)}
            onValueChange={(v) => setLimit(Number(v))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Add Book */}
          <Button className="gap-2" onClick={() => navigate("/create-book")}>
            <Plus size={16} /> Add Book
          </Button>
        </div>
      </div>

      {/* Books Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Copies</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b._id}>
                <TableCell className="font-medium">{b.title}</TableCell>
                <TableCell>{b.author}</TableCell>
                <TableCell>{b.genre.replace("_", " ")}</TableCell>
                <TableCell>{b.isbn}</TableCell>
                <TableCell>{b.copies}</TableCell>
                <TableCell>
                  {b.available && b.copies > 0 ? (
                    <Badge className="bg-green-600/90">Available</Badge>
                  ) : (
                    <Badge variant="destructive">Unavailable</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/books/${b._id}`}>
                      <Button variant="ghost" size="icon" title="View">
                        <Eye size={18} />
                      </Button>
                    </Link>
                    <Link to={`/edit-book/${b._id}`}>
                      <Button variant="ghost" size="icon" title="Edit">
                        <Pencil size={18} />
                      </Button>
                    </Link>
                    <Link to={`/borrow/${b._id}`}>
                      <Button
                        variant="secondary"
                        size="icon"
                        title="Borrow"
                        disabled={!b.available || b.copies === 0}
                      >
                        <Hand size={18} />
                      </Button>
                    </Link>

                    {/* Delete confirm */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="Delete">
                          <Trash2 size={18} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-lg border bg-card p-6 max-w-sm">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this book?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel asChild>
                            <Button variant="secondary">Cancel</Button>
                          </AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button
                              variant="destructive"
                              onClick={() => doDelete(b._id)}
                            >
                              Delete
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-10"
                >
                  No books found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
