import React, { useState } from "react";
import { LineChart, TrendingUp, Calendar, Trophy, Plus, Scale } from "lucide-react";
import { WeightLogEntry, StrengthRecord, WorkoutSessionLog } from "../../types/fitness";
import { Card } from "../ui/AppCard";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/AppButton";

interface AnalyticsViewProps {
  weightLogs: WeightLogEntry[];
  strengthRecords: StrengthRecord[];
  workoutLogs: WorkoutSessionLog[];
  onAddWeightLog: (entry: WeightLogEntry) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  weightLogs,
  strengthRecords,
  workoutLogs,
  onAddWeightLog,
}) => {
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(81.0);
  const [newBodyFat, setNewBodyFat] = useState(14.5);

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: WeightLogEntry = {
      id: `w-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      weightKg: newWeight,
      bodyFatPercent: newBodyFat,
    };
    onAddWeightLog(entry);
    setIsWeightModalOpen(false);
  };

  const latestWeight = weightLogs[0]?.weightKg ? `${weightLogs[0].weightKg}` : "--";
  const latestBodyFat = weightLogs[0]?.bodyFatPercent ? `${weightLogs[0].bodyFatPercent}` : "--";
  const initialWeight = weightLogs[weightLogs.length - 1]?.weightKg;
  const weightChange =
    weightLogs.length > 1 && initialWeight
      ? (parseFloat(latestWeight) - initialWeight).toFixed(1)
      : "0.0";

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Analytics & Progress
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track body composition shifts, 1-Rep Max strength records, and session history
          </p>
        </div>

        <Button onClick={() => setIsWeightModalOpen(true)} variant="primary" className="gap-2">
          <Scale className="w-4 h-4" />
          <span>Log Body Weight</span>
        </Button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card variant="dark">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Current Weight
          </p>
          <p className="text-4xl font-extrabold text-white mt-1">
            {latestWeight}{" "}
            <span className="text-lg font-normal text-zinc-500">
              {weightLogs[0]?.weightKg ? "kg" : ""}
            </span>
          </p>
          <p className="text-xs text-emerald-400 mt-2">
            {weightLogs.length > 0
              ? `${weightChange} kg change tracked`
              : "No weight entries logged yet"}
          </p>
        </Card>

        <Card variant="dark">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Est. Body Fat</p>
          <p className="text-4xl font-extrabold text-white mt-1">
            {latestBodyFat}{" "}
            <span className="text-lg font-normal text-zinc-500">
              {weightLogs[0]?.bodyFatPercent ? "%" : ""}
            </span>
          </p>
          <p className="text-xs text-blue-400 mt-2">
            {weightLogs[0]?.bodyFatPercent
              ? "Body composition recorded"
              : "Log body fat % to track trend"}
          </p>
        </Card>

        <Card variant="dark">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Completed Workouts
          </p>
          <p className="text-4xl font-extrabold text-white mt-1">
            {workoutLogs.length} <span className="text-lg font-normal text-zinc-500">sessions</span>
          </p>
          <p className="text-xs text-amber-400 mt-2">
            {workoutLogs.length > 0
              ? "Live session logs active"
              : "Complete a workout to log history"}
          </p>
        </Card>
      </div>

      {/* Strength Records Section */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Estimated 1-Rep Max (1RM) Records</h3>
          </div>
        </div>

        {strengthRecords.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs bg-zinc-900/50 rounded-xl border border-zinc-900">
            No 1-Rep Max records auto-calculated yet. Complete your first workout session to record
            strength PRs!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {strengthRecords.map((sr) => (
              <div
                key={sr.id}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1"
              >
                <span className="text-[10px] font-bold uppercase text-zinc-500">
                  {sr.exerciseName}
                </span>
                <p className="text-2xl font-extrabold text-white">
                  {sr.estimatedOneRepMaxKg}{" "}
                  <span className="text-xs font-normal text-zinc-400">kg 1RM</span>
                </p>
                <p className="text-xs text-zinc-400">
                  Tested: {sr.weightKg}kg × {sr.reps} reps ({sr.date})
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weight History Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/40">
          <h3 className="text-base font-bold text-white">Weight & Body Composition Log</h3>
        </div>

        {weightLogs.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">
            No weight entries logged yet. Click "Log Body Weight" above to record your weight.
          </div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {weightLogs.map((wl) => (
              <div key={wl.id} className="px-6 py-3.5 flex justify-between items-center text-sm">
                <span className="font-mono text-zinc-400">{wl.date}</span>
                <span className="font-bold text-white">{wl.weightKg} kg</span>
                <span className="text-zinc-400">
                  {wl.bodyFatPercent ? `${wl.bodyFatPercent}% BF` : "--"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Weight Modal */}
      <Modal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        title="Log Weight Measurement"
        subtitle="Record your body weight and body fat percentage"
        maxWidth="sm"
      >
        <form onSubmit={handleSaveWeight} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={newWeight}
              onChange={(e) => setNewWeight(parseFloat(e.target.value) || 70)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
              Body Fat % (Optional)
            </label>
            <input
              type="number"
              step="0.1"
              value={newBodyFat}
              onChange={(e) => setNewBodyFat(parseFloat(e.target.value) || 15)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button type="button" variant="outline" onClick={() => setIsWeightModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
