import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";


const link =
  "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto w-full px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="font-semibold text-lg">
          BookCrate
        </NavLink>
        <nav className="flex items-center gap-2">
          <NavLink to="/books" className={link}>
            All Books
          </NavLink>
          <NavLink to="/borrow-summary" className={link}>
            Borrow Summary
          </NavLink>
          <NavLink to="/create-book">
            <Button size="sm">Add Book</Button>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
