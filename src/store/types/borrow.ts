export type BorrowCreateInput = {
  book: string;
  quantity: number;
  dueDate: string; // ISO
};

export type BorrowRecord = {
  _id: string;
  book: string;
  quantity: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

export type BorrowSummaryItem = {
  book: { title: string; isbn: string };
  totalQuantity: number;
};
