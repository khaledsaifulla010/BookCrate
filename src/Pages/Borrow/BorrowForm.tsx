import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetBookQuery } from "../../store/api/booksApi";
import { useCreateBorrowMutation } from "../../store/api/borrowApi";
import { Input } from "../../components/ui/input";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import CenterSpinner from "../../components/ui/spinner";
const schema = z.object({
  quantity: z.coerce.number().int().min(1),
  dueDate: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function BorrowForm() {
  const { bookId = "" } = useParams();
  const { data: book, isLoading, isError } = useGetBookQuery(bookId);
  const [createBorrow] = useCreateBorrowMutation();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1, dueDate: "" },
  });

  const onSubmit = async (v: FormValues) => {
    if (!book) return;
    if (v.quantity > book.copies) {
      toast.error(`Only ${book.copies} copies available`);
      return;
    }
    const payload = {
      book: book._id,
      quantity: v.quantity,
      dueDate: new Date(v.dueDate).toISOString(),
    };
    const p = createBorrow(payload).unwrap();
    toast.promise(p, {
      loading: "Borrowing...",
      success: "Borrowed successfully",
      error: "Borrow failed",
    });
    try {
      await p;
      navigate("/borrow-summary");
    } catch {
      //
    }
  };

  if (isLoading) return <CenterSpinner label="Loading Book..." />;
  if (isError || !book)
    return (
      <div className="w-full h-[60vh] grid place-items-center">
        <div className="text-red-600 text-center">Book not found.</div>
      </div>
    );

  return (
    <section className="max-w-2xl mx-auto space-y-6 ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Borrow “{book.title}”</h1>
          <p className="text-sm text-muted-foreground">
            {book.author} •{" "}
            <span className="uppercase">{book.genre.replace("_", " ")}</span>
          </p>
        </div>
        <Link to={`/books/${book._id}`}>
          <Button variant="secondary">Back</Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-5 shadow-sm">
        <div className="text-sm grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">ISBN:</span> {book.isbn}
          </div>
          <div>
            <span className="font-medium">Available copies:</span> {book.copies}
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <span className="font-medium">Status:</span>
            {book.available && book.copies > 0 ? (
              <Badge className="bg-emerald-600/90">Available</Badge>
            ) : (
              <Badge variant="destructive">Unavailable</Badge>
            )}
          </div>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                min={1}
                max={book.copies}
                {...form.register("quantity", { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">
                Max: {book.copies}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Input type="date" {...form.register("dueDate")} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!book.available || book.copies === 0}
            >
              Borrow
            </Button>
            <Button
              className="border-2"
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
