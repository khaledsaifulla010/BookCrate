/* eslint-disable react-hooks/exhaustive-deps */
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
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
import { useEffect, useMemo } from "react";
import type { Genre } from "../../store/types/book";
import CenterSpinner from "../../components/ui/spinner";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.enum([
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
  ]),
  isbn: z.string().min(3, "ISBN is required"),
  description: z.string().optional(),
  copies: z.coerce.number().int().min(0, "Copies cannot be negative"),
  available: z.boolean().optional().default(true),
});

type FormValues = z.infer<typeof schema>;

export default function BookForm({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: existing,
    isLoading,
    isError,
  } = useGetBookQuery(id ?? "", { skip: mode !== "edit" || !id });

  const [createBook] = useCreateBookMutation();
  const [updateBook] = useUpdateBookMutation();

  const defaults = useMemo<FormValues>(
    () => ({
      title: "",
      author: "",
      genre: "FICTION",
      isbn: "",
      description: "",
      copies: 1,
      available: true,
    }),
    []
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    shouldUnregister: false,
  });

  useEffect(() => {
    if (mode === "edit" && existing) {
      form.reset({
        title: existing.title ?? "",
        author: existing.author ?? "",
        genre: (existing.genre as Genre) ?? "FICTION",
        isbn: existing.isbn ?? "",
        description: existing.description ?? "",
        copies: typeof existing.copies === "number" ? existing.copies : 0,
        available:
          typeof existing.available === "boolean" ? existing.available : true,
      });
    }
  }, [mode, existing?._id]);

  const onSubmit = async (values: FormValues) => {
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
      //
    }
  };

  if (mode === "edit") {
    if (isLoading) return <CenterSpinner label="Loading Book..." />;
    if (isError || !existing)
      return (
        <div className="w-full h-[60vh] grid place-items-center">
          <div className="text-red-600 text-center">Book not found.</div>
        </div>
      );
  }

  return (
    <section className="max-w-2xl mx-auto space-y-6 -mt-8">
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
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Controller
              name="title"
              control={form.control}
              render={({ field }) => <Input {...field} />}
            />
            <p className="text-xs text-destructive">
              {form.formState.errors.title?.message}
            </p>
          </div>

          {/* Author */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Author</label>
            <Controller
              name="author"
              control={form.control}
              render={({ field }) => <Input {...field} />}
            />
            <p className="text-xs text-destructive">
              {form.formState.errors.author?.message}
            </p>
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Genre</label>
            <Controller
              name="genre"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
              )}
            />
            <p className="text-xs text-destructive">
              {form.formState.errors.genre?.message}
            </p>
          </div>

          {/* ISBN */}
          <div className="space-y-2">
            <label className="text-sm font-medium">ISBN</label>
            <Controller
              name="isbn"
              control={form.control}
              render={({ field }) => <Input {...field} />}
            />
            <p className="text-xs text-destructive">
              {form.formState.errors.isbn?.message}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Controller
            name="description"
            control={form.control}
            render={({ field }) => <Textarea rows={4} {...field} />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Copies */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Copies</label>
            <Controller
              name="copies"
              control={form.control}
              render={({ field }) => (
                <Input
                  type="number"
                  min={0}
                  value={
                    Number.isFinite(field.value as unknown as number)
                      ? field.value
                      : ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? "" : Number(val));
                  }}
                />
              )}
            />
            <p className="text-xs text-destructive">
              {form.formState.errors.copies?.message}
            </p>
          </div>

          {/* Available */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Available</label>
            <Controller
              name="available"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={String(field.value)}
                  onValueChange={(v) => field.onChange(v === "true")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
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
