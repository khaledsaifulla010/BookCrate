export default function CenterSpinner({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div className="w-full h-[60vh] grid place-items-center">
      <div className="flex flex-col items-center gap-3">
        <div
          aria-label="Loading"
          role="status"
          className="h-10 w-10 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin"
        />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
