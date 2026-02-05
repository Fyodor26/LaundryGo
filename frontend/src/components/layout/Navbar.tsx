import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const isLoggedIn = !!user;

  const navLinks = isLoggedIn
    ? [
        { name: "Home", path: "/" },
        { name: "Place Order", path: "/order" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Pricing", path: "/pricing" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Pricing", path: "/pricing" },
      ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Laundry<span className="text-primary">Go</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                activeClassName="bg-primary-soft text-primary"
                pendingClassName="opacity-70"
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!loading &&
              (isLoggedIn ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Hi, {user.name}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to="/auth?mode=signup">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-border">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-medium"
                activeClassName="bg-primary-soft text-primary"
              >
                {link.name}
              </NavLink>
            ))}

            <div className="pt-4">
              {!loading &&
                (isLoggedIn ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Login</Button>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
