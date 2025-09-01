const Footer = () => {
  return (
    <footer className="border-t">
      <div className="max-w-6xl mx-auto w-full px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-6 text-sm text-muted-foreground">
          <div>
            © {new Date().getFullYear()}{" "}
            <span className="font-medium">BookCrate</span>. All rights reserved.
          </div>
          <div className="inline-flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
            <span className="text-xs">Made with BookCrate Ltd.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
