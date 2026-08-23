import React, { useState } from "react";
import {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  Utensils,
  Sparkles,
  LineChart,
  Activity,
  User,
  MessageSquare,
  Camera,
  UtensilsCrossed,
  MapPin,
  Pill,
  Apple,
  Stethoscope,
  ChevronDown,
  ChevronRight,
  Home,
  ScanLine,
  ClipboardList,
} from "lucide-react";
import { NavigationTab } from "../../types/fitness";

interface SidebarRailProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenProfile: () => void;
}

type NavSection = {
  title: string;
  items: { id: NavigationTab; label: string; icon: React.ReactNode }[];
};

export const SidebarRail: React.FC<SidebarRailProps> = ({
  activeTab,
  onTabChange,
  onOpenProfile,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const sections: NavSection[] = [
    {
      title: "Fitness",
      items: [
        { id: "hub", label: "Health Hub", icon: <Home className="w-5 h-5" /> },
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: "workouts", label: "Workouts", icon: <Dumbbell className="w-5 h-5" /> },
        { id: "exercises", label: "Exercise DB", icon: <BookOpen className="w-5 h-5" /> },
        { id: "nutrition", label: "Nutrition", icon: <Utensils className="w-5 h-5" /> },
        { id: "ai-coach", label: "AI Coach", icon: <Sparkles className="w-5 h-5" /> },
        { id: "analytics", label: "Analytics", icon: <LineChart className="w-5 h-5" /> },
        { id: "vitals", label: "Vitals", icon: <Activity className="w-5 h-5" /> },
      ],
    },
    {
      title: "Health",
      items: [
        { id: "chat", label: "AI Doctor", icon: <MessageSquare className="w-5 h-5" /> },
        { id: "food-scan", label: "Food Scanner", icon: <ScanLine className="w-5 h-5" /> },
        { id: "prescription", label: "Prescriptions", icon: <ClipboardList className="w-5 h-5" /> },
        { id: "nearby", label: "Nearby Help", icon: <MapPin className="w-5 h-5" /> },
        { id: "food-log", label: "Food Logs", icon: <UtensilsCrossed className="w-5 h-5" /> },
        { id: "exercise", label: "Home Workouts", icon: <Dumbbell className="w-5 h-5" /> },
      ],
    },
    {
      title: "Encyclopedia",
      items: [
        { id: "encyclopedia-food", label: "Food Info", icon: <Apple className="w-5 h-5" /> },
        { id: "encyclopedia-medicine", label: "Medicines", icon: <Pill className="w-5 h-5" /> },
        {
          id: "encyclopedia-disease",
          label: "Diseases",
          icon: <Stethoscope className="w-5 h-5" />,
        },
      ],
    },
  ];

  const toggleSection = (title: string) => {
    setExpandedSection((prev) => (prev === title ? null : title));
  };

  // Find which section contains the active tab
  const activeSection =
    sections.find((s) => s.items.some((i) => i.id === activeTab))?.title || "Fitness";

  return (
    <aside
      className={`hidden sm:flex flex-col ${isExpanded ? "w-56" : "w-20"} border-r border-zinc-800 py-6 gap-2 bg-zinc-950/80 backdrop-blur-md select-none shrink-0 z-20 transition-all duration-300`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setExpandedSection(null);
      }}
    >
      {/* Brand Logo */}
      <div className="flex items-center justify-center px-4 mb-4">
        <button
          onClick={() => onTabChange("dashboard")}
          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-white/5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          title="FitMadix Home"
          type="button"
        >
          <img src="/logo.jpg" alt="FitMadix Logo" className="w-7 h-7 object-contain" />
        </button>
        {isExpanded && (
          <span className="ml-3 text-sm font-bold text-white tracking-tight whitespace-nowrap overflow-hidden">
            FITMADIX
          </span>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden px-2">
        {sections.map((section) => {
          const isSectionExpanded =
            isExpanded && (expandedSection === section.title || activeSection === section.title);
          const sectionHasActive = section.items.some((i) => i.id === activeTab);

          return (
            <div key={section.title}>
              {/* Section Header (only shown when sidebar is expanded) */}
              {isExpanded && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded"
                  type="button"
                >
                  <span>{section.title}</span>
                  {isSectionExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              )}

              {/* Items */}
              <div
                className={`flex flex-col gap-0.5 ${isExpanded && !isSectionExpanded ? "hidden" : ""}`}
              >
                {(isExpanded
                  ? section.items
                  : sectionHasActive
                    ? section.items.filter((i) => i.id === activeTab)
                    : section.items.slice(0, 1)
                ).map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`group relative flex items-center gap-3 rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
                        isExpanded ? "px-3 py-2.5" : "p-3 justify-center"
                      } ${
                        isActive
                          ? "bg-zinc-800 text-white shadow-inner border border-zinc-700"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/80"
                      }`}
                      title={item.label}
                      type="button"
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {isExpanded && (
                        <span className="text-xs font-semibold whitespace-nowrap overflow-hidden">
                          {item.label}
                        </span>
                      )}
                      {/* Tooltip (only when collapsed) */}
                      {!isExpanded && (
                        <span className="absolute left-16 px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-800 z-50 shadow-xl">
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Profile avatar */}
      <div className="px-2">
        <button
          onClick={onOpenProfile}
          className={`w-full flex items-center gap-3 rounded-xl border border-zinc-700 bg-gradient-to-tr from-zinc-800 to-zinc-950 hover:border-zinc-500 transition-colors text-zinc-300 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
            isExpanded ? "px-3 py-2.5" : "p-3 justify-center"
          }`}
          title="User Profile & Settings"
          type="button"
        >
          <User className="w-4 h-4 shrink-0" />
          {isExpanded && <span className="text-xs font-semibold whitespace-nowrap">Profile</span>}
        </button>
      </div>
    </aside>
  );
};
