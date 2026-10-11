import React, { useState, useContext } from "react";
import { Search, Plus, Trash2, Dumbbell, Save } from "lucide-react";
import { Routine, RoutineExercise, ExerciseCategory } from "../../types/fitness";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/AppButton";
import { AuthenticatedContext } from "../../routes/_authenticated/route";

interface RoutineBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRoutine: (routine: Routine) => void;
  initialRoutine?: Routine | null;
}

export const RoutineBuilderModal: React.FC<RoutineBuilderModalProps> = ({
  isOpen,
  onClose,
  onSaveRoutine,
  initialRoutine,
}) => {
  const context = useContext(AuthenticatedContext);
  const EXERCISES_DATABASE = context?.exercises || [];
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Hypertrophy");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Intermediate",
  );
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([]);

  const handleAddExercise = (exerciseId: string) => {
    const found = EXERCISES_DATABASE.find((e) => e.id === exerciseId);
    if (!found) return;

    const newEx: RoutineExercise = {
      exerciseId: found.id,
      exerciseName: found.name,
      category: found.category,
      sets: found.defaultSets,
      reps: found.defaultReps,
      targetWeightKg: 40,
      restSeconds: found.restSeconds,
    };

    setSelectedExercises((prev) => [...prev, newEx]);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetMuscles = Array.from(new Set(selectedExercises.map((e) => e.category))) as string[];

    const newRoutine: Routine = {
      id: `custom-routine-${Date.now()}`,
      title,
      subtitle: subtitle || `${targetMuscles.join(" & ")} Focus`,
      category,
      durationMinutes,
      targetMuscles,
      difficulty,
      exercises: selectedExercises,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    onSaveRoutine(newRoutine);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Custom Routine"
      subtitle="Build a personalized workout split with targeted exercises and sets"
      maxWidth="xl"
    >
      <form onSubmit={handleSave} className="space-y-5">
        {/* Title & Subtitle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Routine Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chest & Triceps Blast"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Subtitle Focus
            </label>
            <input
              type="text"
              placeholder="e.g. Upper Body Hypertrophy"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>
        </div>

        {/* Category & Duration */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Duration (mins)
            </label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 45)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Add Exercise Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Add Exercise from Database
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleAddExercise(e.target.value);
                e.target.value = "";
              }
            }}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 cursor-pointer"
          >
            <option value="">-- Choose an exercise to add --</option>
            {EXERCISES_DATABASE.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.category})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Exercise List */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Selected Exercises ({selectedExercises.length})
          </p>

          {selectedExercises.length === 0 ? (
            <div className="p-6 border border-dashed border-zinc-800 rounded-xl text-center text-zinc-500 text-xs">
              No exercises added yet. Pick exercises above.
            </div>
          ) : (
            selectedExercises.map((ex, idx) => (
              <div
                key={idx}
                className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-bold text-white">{ex.exerciseName}</p>
                  <p className="text-xs text-zinc-400">
                    {ex.sets} sets × {ex.reps} • Rest {ex.restSeconds}s
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExercise(idx)}
                  className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={selectedExercises.length === 0}>
            Save Routine
          </Button>
        </div>
      </form>
    </Modal>
  );
};
