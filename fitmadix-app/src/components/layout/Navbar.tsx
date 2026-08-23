import React, { useState } from "react";
import { Search, Flame, Sun, Moon, Sparkles } from "lucide-react";
import { NavigationTab } from "../../types/fitness";

interface NavbarProps {
  activeTab: NavigationTab;
  streakDays: number;
  onSelectTab: (tab: NavigationTab) => void;
  onSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  streakDays,
  onSelectTab,
  onSearchQuery,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const tabLabels: Record<NavigationTab, string> = {
    dashboard: "Performance",
    workouts: "Routines & Live Tracker",
    exercises: "Exercise Database",
    nutrition: "Macros & Meal Log",
    "ai-coach": "AI Fitness & Nutrition Coach",
    analytics: "Strength & Body Analytics",
    vitals: "Wearables & Vitals Sync",
    hub: "Health Hub",
    chat: "AI Doctor Consultation",
    "food-log": "Daily Food Log",
    "food-scan": "Food Scanner",
    prescription: "Prescription Reader",
    nearby: "Nearby Facilities",
    profile: "Your Profile",
    exercise: "Home Workouts",
    "encyclopedia-food": "Food Encyclopedia",
    "encyclopedia-medicine": "Medicine Encyclopedia",
    "encyclopedia-disease": "Disease Encyclopedia",
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearchQuery(e.target.value);
  };

  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-black/90 backdrop-blur-md shrink-0 select-none z-10">
      {/* Breadcrumb Path */}
      <div className="flex items-center gap-3 text-sm font-medium tracking-tight">
        <img src="/logo.jpg" alt="FitMadix Logo" className="h-6 object-contain" />
        <span className="text-zinc-700">/</span>
        <span className="text-white font-bold">{tabLabels[activeTab]}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search routines & exercises..."
            className="h-9 w-32 sm:w-48 md:w-60 bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus-visible:outline-none focus-visible:border-zinc-600 focus-visible:ring-2 focus-visible:ring-zinc-400 transition-all"
          />
        </div>

        {/* Streak Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
          <Flame className="w-4 h-4 fill-amber-400" />
          <span>{streakDays} Days Streak</span>
        </div>

        {/* AI Quick Button */}
        <button
          onClick={() => onSelectTab("ai-coach")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 shrink-0"
          type="button"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">AI Coach</span>
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 shrink-0"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          type="button"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
