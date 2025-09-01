import { useParams, Link } from "react-router-dom";
import { useGetBookQuery } from "../../store/api/booksApi";
import { Button } from "../../components/ui/button";
import { fmtDate } from "../../utils/format";

export default function BookDetails() {
  const { id = "" } = useParams();
  const { data: b, isLoading, isError } = useGetBookQuery(id);

  if (isLoading) return <div>Loading book...</div>;
  if (isError || !b) return <div className="text-red-600">Book not found.</div>;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{b.title}</h1>
        <div className="flex gap-2">
          <Link to={`/edit-book/${b._id}`}>
            <Button>Edit</Button>
          </Link>
          <Link to={`/borrow/${b._id}`}>
            <Button
              variant="secondary"
              disabled={!b.available || b.copies === 0}
            >
              Borrow
            </Button>
          </Link>
          <Link to="/books">
            <Button variant="ghost">Back</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border bg-white p-4">
          <h2 className="text-lg font-medium">Details</h2>
          <div className="text-sm">
            <div>
              <span className="font-medium">Author:</span> {b.author}
            </div>
            <div>
              <span className="font-medium">Genre:</span>{" "}
              {b.genre.replace("_", " ")}
            </div>
            <div>
              <span className="font-medium">ISBN:</span> {b.isbn}
            </div>
            <div>
              <span className="font-medium">Copies:</span> {b.copies}
            </div>
            <div>
              <span className="font-medium">Availability:</span>{" "}
              {b.available ? "Available" : "Unavailable"}
            </div>
            <div>
              <span className="font-medium">Created:</span>{" "}
              {fmtDate(b.createdAt)}
            </div>
            <div>
              <span className="font-medium">Updated:</span>{" "}
              {fmtDate(b.updatedAt)}
            </div>
          </div>
        </div>
        <div className="space-y-2 rounded-lg border bg-white p-4">
          <h2 className="text-lg font-medium">Description</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {b.description || "No description."}
          </p>
        </div>
      </div>

      <Link to="/books" className="underline underline-offset-2">
        ← Back to list
      </Link>
    </section>
  );
}
