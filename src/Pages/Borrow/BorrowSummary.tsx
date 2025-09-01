import { useGetBorrowSummaryQuery } from "../../store/api/borrowApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import CenterSpinner from "../../components/ui/spinner";

export default function BorrowSummary() {
  const { data = [], isLoading, isError } = useGetBorrowSummaryQuery();

  if (isLoading) return <CenterSpinner label="Loading Borrow Summary..." />;
  if (isError)
    return (
      <div className="text-red-600 text-center w-full h-[60vh] grid place-items-center">
        Failed to load summary.
      </div>
    );

  const totalBorrowed = data.reduce((s, x) => s + x.totalQuantity, 0);

  return (
    <section className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Borrow Summary</h1>
        <p className="text-sm text-muted-foreground">
          Total items borrowed:{" "}
          <span className="font-medium">{totalBorrowed}</span>
        </p>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader className="sticky top-0 z-[1] bg-card">
            <TableRow>
              <TableHead className="w-[72px] text-center">SL/No</TableHead>
              <TableHead className="text-center">Book Title</TableHead>
              <TableHead className="text-center">ISBN</TableHead>
              <TableHead className="text-center">
                Total Quantity Borrowed
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow
                key={`${row.book.isbn}-${i}`}
                className="hover:bg-muted/40"
              >
                <TableCell className="font-medium text-center">
                  {i + 1}
                </TableCell>
                <TableCell className="font-medium text-center">
                  {row.book.title}
                </TableCell>
                <TableCell className="text-center">{row.book.isbn}</TableCell>
                <TableCell className="text-center">
                  {row.totalQuantity}
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-10"
                >
                  No borrow records yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
