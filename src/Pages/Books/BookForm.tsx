import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateBookMutation,
  useGetBookQuery,
  useUpdateBookMutation,
} from "../../store/api/booksApi";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import toast from "react-hot-toast";
import { useEffect } from "react";
import type { Genre } from "../../store/types/book";

const schema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  genre: z.enum([
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
  ]),
  isbn: z.string().min(3),
  description: z.string().optional(),
  copies: z.coerce.number().int().min(0),
  available: z.boolean().optional().default(true),
});

type FormValues = z.infer<typeof schema>;

export default function BookForm({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: existing, isLoading: loadingBook } = useGetBookQuery(id ?? "", {
    skip: mode === "create" || !id,
  });

  const [createBook] = useCreateBookMutation();
  const [updateBook] = useUpdateBookMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      author: "",
      genre: "FICTION",
      isbn: "",
      description: "",
      copies: 1,
      available: true,
    },
  });

  // hydrate for edit
  useEffect(() => {
    if (mode === "edit" && existing) {
      form.reset({
        title: existing.title,
        author: existing.author,
        genre: existing.genre as Genre,
        isbn: existing.isbn,
        description: existing.description ?? "",
        copies: existing.copies,
        available: existing.available,
      });
    }
  }, [existing, form, mode]);

  const onSubmit = async (values: FormValues) => {
    // business rule: if copies = 0, force available=false
    const body = {
      ...values,
      available: values.copies === 0 ? false : values.available ?? true,
    };

    try {
      if (mode === "create") {
        const p = createBook(body).unwrap();
        toast.promise(p, {
          loading: "Creating...",
          success: "Book created",
          error: "Create failed",
        });
        await p;
        navigate("/books");
      } else if (mode === "edit" && id) {
        const p = updateBook({ id, body }).unwrap();
        toast.promise(p, {
          loading: "Updating...",
          success: "Book updated",
          error: "Update failed",
        });
        await p;
        navigate(`/books/${id}`);
      }
    } catch {
      // handled by toast
    }
  };

  if (mode === "edit" && loadingBook) return <div>Loading...</div>;

  return (
    <section className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {mode === "create" ? "Add Book" : "Edit Book"}
        </h1>
      </div>

      <form
        className="space-y-4 rounded-lg border bg-card p-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input {...form.register("title")} />
            <p className="text-xs text-destructive">
              {form.formState.errors.title?.message}
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Author</label>
            <Input {...form.register("author")} />
            <p className="text-xs text-destructive">
              {form.formState.errors.author?.message}
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Genre</label>
            <Select
              value={form.watch("genre")}
              onValueChange={(v) => form.setValue("genre", v as Genre)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FICTION">Fiction</SelectItem>
                <SelectItem value="NON_FICTION">Non-fiction</SelectItem>
                <SelectItem value="SCIENCE">Science</SelectItem>
                <SelectItem value="HISTORY">History</SelectItem>
                <SelectItem value="BIOGRAPHY">Biography</SelectItem>
                <SelectItem value="FANTASY">Fantasy</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-destructive">
              {form.formState.errors.genre?.message}
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">ISBN</label>
            <Input {...form.register("isbn")} />
            <p className="text-xs text-destructive">
              {form.formState.errors.isbn?.message}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea rows={4} {...form.register("description")} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Copies</label>
            <Input
              type="number"
              min={0}
              {...form.register("copies", { valueAsNumber: true })}
            />
            <p className="text-xs text-destructive">
              {form.formState.errors.copies?.message}
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Available</label>
            <Select
              value={String(form.watch("available"))}
              onValueChange={(v) => form.setValue("available", v === "true")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit">
            {mode === "create" ? "Create Book" : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
}
