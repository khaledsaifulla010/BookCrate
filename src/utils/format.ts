import { format } from "date-fns";
export const fmtDate = (iso?: string) =>
  iso ? format(new Date(iso), "PP") : "";
