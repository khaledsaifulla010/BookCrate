const Footer = () => {
  return (
    <footer className="border-t">
      <div className="max-w-6xl mx-auto w-full px-4 py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} BookCrate. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
