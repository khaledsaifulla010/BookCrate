import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import logo from "../../assets/logo.png";

const baseLink =
  "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary/80";
const activeLink =
  "px-3 py-2 rounded-md text-sm font-semibold bg-secondary text-foreground";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto w-full px-4">
        <div className="flex items-center justify-between py-3">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 font-bold text-lg leading-none"
          >
            <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/15 to-blue-500/10 text-indigo-600">
              <img className="w-6 h-6" src={logo} alt="" />
            </span>
            <span className="bg-clip-text text-2xl text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
              BookCrate
            </span>
          </NavLink>

          <nav className="flex items-center gap-1 md:gap-2">
            <NavLink
              to="/books"
              className={({ isActive }) => (isActive ? activeLink : baseLink)}
            >
              All Books
            </NavLink>
            <NavLink
              to="/borrow-summary"
              className={({ isActive }) => (isActive ? activeLink : baseLink)}
            >
              Borrow Summary
            </NavLink>
            <NavLink to="/create-book">
              <Button size="sm" className="gap-2 shadow-sm hover:shadow">
                <Plus size={16} />
                Add Book
              </Button>
            </NavLink>
          </nav>
        </div>
      </div>
      <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500/50 via-blue-500/40 to-cyan-500/30" />
    </header>
  );
};

export default Navbar;
