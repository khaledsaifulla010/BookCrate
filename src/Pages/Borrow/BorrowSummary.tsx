import { useGetBorrowSummaryQuery } from "../../store/api/borrowApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

export default function BorrowSummary() {
  const { data = [], isLoading, isError } = useGetBorrowSummaryQuery();

  if (isLoading) return <div>Loading borrow summary...</div>;
  if (isError)
    return <div className="text-red-600">Failed to load summary.</div>;

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-semibold">Borrow Summary</h1>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book Title</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead className="text-right">
                Total Quantity Borrowed
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{row.book.title}</TableCell>
                <TableCell>{row.book.isbn}</TableCell>
                <TableCell className="text-right">
                  {row.totalQuantity}
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
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
