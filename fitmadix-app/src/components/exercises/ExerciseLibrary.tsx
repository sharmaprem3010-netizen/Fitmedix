import React, { useState, useContext } from "react";
import { Search, Dumbbell, Filter, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import { Exercise, ExerciseCategory } from "../../types/fitness";
import { Modal } from "../ui/Modal";
import { Badge } from "../ui/AppBadge";
import { AuthenticatedContext } from "../../routes/_authenticated/route";

interface ExerciseLibraryProps {
  searchQuery?: string;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ searchQuery = "" }) => {
  const context = useContext(AuthenticatedContext);
  const [localSearch, setLocalSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const categories: string[] = [
    "All",
    "Chest",
    "Back",
    "Legs",
    "Shoulders",
    "Arms",
    "Core",
    "Cardio",
  ];

  const query = (localSearch || searchQuery).toLowerCase();

  const exercises = context?.exercises || [];

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = query
      ? ex.name.toLowerCase().includes(query) ||
        ex.primaryMuscle.toLowerCase().includes(query) ||
        ex.equipment.toLowerCase().includes(query)
      : true;

    const matchesCat = selectedCategory === "All" || ex.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Exercise Database</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Explore 30+ verified movement patterns with anatomical muscle targeting and cues
          </p>
        </div>

        {/* Local Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search exercises, muscles..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-white text-black shadow-md"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            onClick={() => setSelectedExercise(ex)}
            className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 transition-all hover:scale-[1.01] cursor-pointer flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <Badge variant="blue">{ex.category}</Badge>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  {ex.equipment}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                {ex.name}
              </h3>

              <div className="mt-3 space-y-1.5">
                <p className="text-xs text-zinc-400">
                  <strong className="text-zinc-200">Primary Muscle:</strong> {ex.primaryMuscle}
                </p>
                {ex.secondaryMuscles && ex.secondaryMuscles.length > 0 && (
                  <p className="text-xs text-zinc-500">
                    <strong>Secondary:</strong> {ex.secondaryMuscles.join(", ")}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-900 flex justify-between items-center text-xs text-zinc-400 font-medium">
              <span>
                Default: {ex.defaultSets} × {ex.defaultReps}
              </span>
              <span className="text-blue-400 group-hover:underline">View Guide →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <Modal
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          title={selectedExercise.name}
          subtitle={`${selectedExercise.category} • ${selectedExercise.equipment} • ${selectedExercise.difficulty}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Target Muscles Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                <p className="text-[10px] font-bold uppercase text-zinc-500">Primary Target</p>
                <p className="text-sm font-bold text-white">{selectedExercise.primaryMuscle}</p>
              </div>
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                <p className="text-[10px] font-bold uppercase text-zinc-500">
                  Secondary Synergists
                </p>
                <p className="text-sm font-bold text-zinc-300">
                  {selectedExercise.secondaryMuscles?.join(", ") || "None"}
                </p>
              </div>
            </div>

            {/* Step-by-Step Execution */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Execution Instructions
              </h4>
              <ol className="space-y-2">
                {selectedExercise.instructions.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80"
                  >
                    <span className="w-5 h-5 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Pro Cues */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                Coach Cues & Form Cautions
              </h4>
              <ul className="space-y-1.5">
                {selectedExercise.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
