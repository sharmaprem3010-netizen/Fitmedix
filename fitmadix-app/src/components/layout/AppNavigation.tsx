import React, { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { 
  Home, 
  Dumbbell, 
  Utensils, 
  MessageSquare, 
  HeartPulse, 
  BookOpen, 
  LineChart, 
  Bell, 
  User, 
  Menu,
  X,
  LayoutDashboard
} from "lucide-react";
import { NavigationTab } from "../../types/fitness";

interface AppNavigationProps {
  onOpenProfile: () => void;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({ onOpenProfile }) => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper to determine if a route is active
  const isActive = (path: string) => {
    if (path === '/dashboard' && currentPath === '/dashboard') return true;
    if (path !== '/dashboard' && currentPath.startsWith(path)) return true;
    return false;
  };

  const desktopNavItems = [
    { label: "Home", path: "/dashboard", icon: <Home className="w-4 h-4 mr-2" /> },
    { label: "Hub", path: "/hub", icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { label: "Workout", path: "/workouts", icon: <Dumbbell className="w-4 h-4 mr-2" /> },
    { label: "Nutrition", path: "/nutrition", icon: <Utensils className="w-4 h-4 mr-2" /> },
    { label: "Coach", path: "/chat", icon: <MessageSquare className="w-4 h-4 mr-2" /> },
    { label: "Health", path: "/symptoms", icon: <HeartPulse className="w-4 h-4 mr-2" /> },
    { label: "Encyclopedia", path: "/encyclopedia", icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { label: "Progress", path: "/analytics", icon: <LineChart className="w-4 h-4 mr-2" /> },
  ];

  const mobileNavItems = [
    { label: "Home", path: "/dashboard", icon: <Home className="w-6 h-6" /> },
    { label: "Hub", path: "/hub", icon: <LayoutDashboard className="w-6 h-6" /> },
    { label: "Workout", path: "/workouts", icon: <Dumbbell className="w-6 h-6" /> },
    { label: "Nutrition", path: "/nutrition", icon: <Utensils className="w-6 h-6" /> },
    { label: "Coach", path: "/chat", icon: <MessageSquare className="w-6 h-6" /> },
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="hidden md:flex fixed top-0 w-full z-50 bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/60 border-b border-border h-16 items-center px-6 justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-lg leading-none">F</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight hidden lg:block">Fitmadix</span>
          </Link>
          
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {desktopNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path) 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-surface transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
          </button>
          <div className="w-px h-6 bg-border mx-1"></div>
          <button 
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1.5 pr-3 bg-surface border border-border hover:border-primary/50 rounded-full transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium hidden lg:block">Profile</span>
          </button>
        </div>
      </nav>

      {/* Mobile Top Header (Minimal) */}
      <header className="md:hidden fixed top-0 w-full z-40 bg-background/95 backdrop-blur-xl border-b border-border h-14 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm leading-none">F</span>
          </div>
          <span className="font-extrabold text-lg tracking-tight">Fitmadix</span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-muted-foreground hover:text-foreground"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer (Secondary Nav) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background pt-14 pb-20 overflow-y-auto">
          <div className="px-4 py-6 space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Library</h3>
              <Link onClick={() => setMobileMenuOpen(false)} to="/encyclopedia" className="flex items-center p-3 rounded-xl hover:bg-surface transition-colors">
                <BookOpen className="w-5 h-5 mr-3 text-blue-500" />
                <span className="font-medium">Encyclopedia</span>
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/symptoms" className="flex items-center p-3 rounded-xl hover:bg-surface transition-colors">
                <HeartPulse className="w-5 h-5 mr-3 text-red-500" />
                <span className="font-medium">Health & Symptoms</span>
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/analytics" className="flex items-center p-3 rounded-xl hover:bg-surface transition-colors">
                <LineChart className="w-5 h-5 mr-3 text-purple-500" />
                <span className="font-medium">Detailed Progress</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Bar (Primary Nav) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-background/95 backdrop-blur-xl border-t border-border pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenProfile();
            }}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium leading-none">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
