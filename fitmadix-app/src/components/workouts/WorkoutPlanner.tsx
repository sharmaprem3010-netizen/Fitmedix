import React, { useState } from 'react';
import { Play, Plus, Dumbbell, Clock, Flame, Trash2, Tag } from 'lucide-react';
import { Routine, WorkoutSessionLog } from '../../types/fitness';
import { Card } from '../ui/AppCard';
import { Button } from '../ui/AppButton';
import { Badge } from '../ui/AppBadge';
import { RoutineBuilderModal } from './RoutineBuilderModal';

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
  searchQuery = '',
}) => {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(routines.map(r => r.category)))];

  const filteredRoutines = routines.filter(r => {
    const matchesSearch = searchQuery
      ? r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory = selectedCategoryFilter === 'All' || r.category === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Workout Routines</h1>
          <p className="text-sm text-zinc-400 mt-1">
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
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategoryFilter === cat
                ? 'bg-white text-black shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutines.map(routine => {
          return (
            <Card
              key={routine.id}
              variant="dark"
              className="flex flex-col justify-between group hover:border-zinc-700 transition-all relative"
            >
              <div>
                {/* Badge Row */}
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="zinc">{routine.category}</Badge>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{routine.durationMinutes} mins</span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                  {routine.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 mb-4">{routine.subtitle}</p>

                {/* Exercises Preview */}
                <div className="space-y-2 border-t border-b border-zinc-900 py-3 mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Exercises ({routine.exercises.length})
                  </p>
                  <ul className="space-y-1">
                    {routine.exercises.slice(0, 4).map((ex, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 flex justify-between">
                        <span>{ex.exerciseName}</span>
                        <span className="text-zinc-500 font-mono">{ex.sets} × {ex.reps}</span>
                      </li>
                    ))}
                    {routine.exercises.length > 4 && (
                      <li className="text-[11px] text-zinc-500 italic">
                        +{routine.exercises.length - 4} more exercises
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onStartWorkout(routine)}
                  className="flex-1 py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>START WORKOUT</span>
                </button>

                {routine.isCustom && (
                  <button
                    onClick={() => onDeleteRoutine(routine.id)}
                    className="p-3 bg-zinc-900 hover:bg-rose-500/10 hover:text-rose-400 border border-zinc-800 rounded-xl text-zinc-500 transition-colors cursor-pointer"
                    title="Delete custom routine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Card>
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
