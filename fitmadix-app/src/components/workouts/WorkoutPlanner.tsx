import React, { useState } from "react";
import { Play, Plus, Dumbbell, Clock, Trash2 } from "lucide-react";
import { Routine } from "../../types/fitness";
import { Button } from "../ui/AppButton";
import { Badge } from "../ui/AppBadge";
import { RoutineBuilderModal } from "./RoutineBuilderModal";
import { useAccessibility } from "../AccessibilityProvider";
import { usePageIntro } from "../../hooks/usePageIntro";

interface WorkoutPlannerProps {
  routines: Routine[];
  onStartWorkout: (routine: Routine) => void;
  onSaveRoutine: (routine: Routine) => void;
  onDeleteRoutine: (routineId: string) => void;
  searchQuery?: string;
}

export const WorkoutPlanner: React.FC<WorkoutPlannerProps> = ({
  routines,
  onStartWorkout,
  onSaveRoutine,
  onDeleteRoutine,
  searchQuery = "",
}) => {
  const { language } = useAccessibility();
  const intro = language.startsWith("en") ? "You are in Workouts. Say 'Start Workout' to begin."
              : language.startsWith("hi") ? "आप वर्कआउट में हैं।" : "আপনি ওয়ার্কআউট পৃষ্ঠায় আছেন।";
  usePageIntro(intro);

  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(routines.map((r) => r.category)))];

  const filteredRoutines = routines.filter((r) => {
    const matchesSearch = searchQuery
      ? r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory =
      selectedCategoryFilter === "All" || r.category === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Workout Routines</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pick a structured split or create your custom workout routine
          </p>
        </div>

        <Button onClick={() => setIsBuilderOpen(true)} variant="primary" className="gap-2">
          <Plus className="w-4 h-4" />
          <span>New Custom Routine</span>
        </Button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategoryFilter === cat
                ? "bg-foreground text-background shadow-md"
                : "bg-surface text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Routine List View */}
      <div className="flex flex-col gap-4">
        {filteredRoutines.map((routine) => {
          return (
            <div
              key={routine.id}
              className="flex flex-col sm:flex-row gap-6 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow items-center justify-between group"
            >
              <div className="flex-1 w-full">
                {/* Badge Row */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="px-2 py-1 bg-surface border border-border rounded-md text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {routine.category}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{routine.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>{routine.exercises.length} exercises</span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  {routine.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{routine.subtitle}</p>

                {/* Exercises Preview */}
                <p className="text-xs text-muted-foreground mt-3 font-medium flex items-center gap-2 overflow-hidden whitespace-nowrap text-ellipsis">
                  {routine.exercises.slice(0, 3).map(e => e.exerciseName).join(" • ")}
                  {routine.exercises.length > 3 && ` • +${routine.exercises.length - 3} more`}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 mt-4 sm:mt-0">
                <button
                  onClick={() => onStartWorkout(routine)}
                  className="flex-1 sm:flex-none px-6 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start</span>
                </button>

                {routine.isCustom && (
                  <button
                    onClick={() => onDeleteRoutine(routine.id)}
                    className="p-3 bg-surface hover:bg-chart-4/10 hover:text-chart-4 border border-border rounded-xl text-muted-foreground transition-colors cursor-pointer shrink-0"
                    title="Delete custom routine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Routine Builder Modal */}
      <RoutineBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onSaveRoutine={onSaveRoutine}
      />
    </div>
  );
};
