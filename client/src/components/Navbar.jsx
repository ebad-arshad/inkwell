import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PenLine, Bookmark, User as UserIcon, LogOut, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/feed?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMobileOpen(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "?";

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight text-foreground">
            Inkwell
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium font-body">
            <Link to="/latest" className="text-muted-foreground hover:text-foreground transition-colors">Latest</Link>
            <Link to="/trending" className="text-muted-foreground hover:text-foreground transition-colors">Trending</Link>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          <ModeToggle />
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-64 rounded-full border border-input bg-muted/50 pl-9 pr-4 text-sm font-body outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </form>

          {user ? (
            <>
              <Button variant="default" size="sm" className="gap-2 rounded-full" onClick={() => navigate("/write")}>
                <PenLine className="h-4 w-4" />
                Write
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full ring-2 ring-transparent transition-all hover:ring-primary/50">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-body font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user._id}`)}>
                    <UserIcon className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/bookmarks")}>
                    <Bookmark className="mr-2 h-4 w-4" /> Bookmarks
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Sign in</Button>
              <Button size="sm" className="rounded-full" onClick={() => navigate("/signup")}>Get started</Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden animate-fade-in">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-full border border-input bg-muted/50 pl-9 pr-4 text-sm font-body outline-none focus:border-primary"
              />
            </div>
          </form>
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Theme</span>
                <ModeToggle />
              </div>
              <Button variant="ghost" onClick={() => { navigate("/latest"); setMobileOpen(false); }}>
                Latest
              </Button>
              <Button variant="ghost" onClick={() => { navigate("/trending"); setMobileOpen(false); }}>
                Trending
              </Button>
              <Button variant="default" className="gap-2 rounded-full" onClick={() => { navigate("/write"); setMobileOpen(false); }}>
                <PenLine className="h-4 w-4" /> Write
              </Button>
              <Button variant="ghost" onClick={() => { navigate(`/profile/${user._id}`); setMobileOpen(false); }}>
                <UserIcon className="mr-2 h-4 w-4" /> Profile
              </Button>
              <Button variant="ghost" onClick={() => { navigate("/bookmarks"); setMobileOpen(false); }}>
                <Bookmark className="mr-2 h-4 w-4" /> Bookmarks
              </Button>
              <Button variant="ghost" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button variant="ghost" onClick={() => { navigate("/login"); setMobileOpen(false); }}>Sign in</Button>
              <Button className="rounded-full" onClick={() => { navigate("/signup"); setMobileOpen(false); }}>Get started</Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
