import { useParams, Link } from "react-router-dom";
import { useGetBookQuery } from "../../store/api/booksApi";
import { Button } from "../../components/ui/button";
import { fmtDate } from "../../utils/format";
import { Badge } from "../../components/ui/badge";
import CenterSpinner from "../../components/ui/spinner";

export default function BookDetails() {
  const { id = "" } = useParams();
  const { data: b, isLoading, isError } = useGetBookQuery(id);

  if (isLoading) return <CenterSpinner label="Loading Book..." />;
  if (isError || !b)
    return (
      <div className="w-full h-[60vh] grid place-items-center">
        <div className="text-red-600 text-center">Book not found.</div>
      </div>
    );
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{b.title}</h1>
          <p className="text-sm text-muted-foreground">
            {b.author} •{" "}
            <span className="uppercase">{b.genre.replace("_", " ")}</span>
          </p>
        </div>
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
        <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-medium">Details</h2>
          <div className="text-sm grid grid-cols-1 gap-2">
            <div>
              <span className="font-medium">ISBN:</span> {b.isbn}
            </div>
            <div>
              <span className="font-medium">Copies:</span> {b.copies}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Availability:</span>
              {b.available && b.copies > 0 ? (
                <Badge className="bg-emerald-600/90">Available</Badge>
              ) : (
                <Badge variant="destructive">Unavailable</Badge>
              )}
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

        <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-medium">Description</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {b.description || "No description."}
          </p>
        </div>
      </div>

      <Link
        to="/books"
        className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to list
      </Link>
    </section>
  );
}
