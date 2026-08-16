import React, { useState } from 'react';
import { Play, Sparkles, TrendingUp, Heart, Cpu, Flame, Calendar, ArrowUpRight } from 'lucide-react';
import { VitalsData, Routine, NavigationTab, MealItem, MacroTargets, WorkoutSessionLog } from '../../types/fitness';
import { ProgressRing } from '../ui/ProgressRing';

interface OverviewDashboardProps {
  vitals: VitalsData;
  nextRoutine: Routine;
  meals: MealItem[];
  macroTargets: MacroTargets;
  workoutLogs: WorkoutSessionLog[];
  onStartWorkout: (routine: Routine) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  vitals,
  nextRoutine,
  meals,
  macroTargets,
  workoutLogs,
  onStartWorkout,
  onNavigate,
}) => {
  const [outputMetric, setOutputMetric] = useState<'kwh' | 'volume' | 'calories'>('kwh');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

  // Dynamic nutrition calculations
  const totalCaloriesLogged = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProteinLogged = meals.reduce((acc, m) => acc + m.proteinG, 0);
  const totalCarbsLogged = meals.reduce((acc, m) => acc + m.carbsG, 0);
  const totalFatLogged = meals.reduce((acc, m) => acc + m.fatG, 0);

  // Dynamic workout calories
  const totalWorkoutCalories = workoutLogs.reduce((acc, w) => acc + w.caloriesBurnedEstimate, 0);

  // Generate dynamic weekly chart
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = daysOfWeek.map((day, idx) => {
    const dayLogs = workoutLogs.filter(log => {
      const d = new Date(log.startTime);
      const dayNum = d.getDay();
      const mappedIdx = dayNum === 0 ? 6 : dayNum - 1;
      return mappedIdx === idx;
    });

    const dayVol = dayLogs.reduce((sum, l) => sum + l.totalVolumeKg, 0);
    const dayCals = dayLogs.reduce((sum, l) => sum + l.caloriesBurnedEstimate, 0);
    const dayKwh = Math.round((dayCals / 200) * 10) / 10;

    return {
      day,
      kwh: dayKwh,
      volumeKg: dayVol,
      calories: dayCals,
      heightPct: dayVol > 0 ? Math.min(100, Math.max(20, (dayVol / 5000) * 100)) : 8,
    };
  });

  const getHeroDisplay = () => {
    switch (outputMetric) {
      case 'kwh':
        return { value: vitals.weeklyOutputKwh.toFixed(1), unit: 'kW/h' };
      case 'volume':
        return { value: (vitals.totalWeeklyVolumeKg / 1000).toFixed(1), unit: 'k kg' };
      case 'calories':
        return { value: totalWorkoutCalories.toLocaleString(), unit: 'kcal' };
    }
  };

  const heroDisplay = getHeroDisplay();

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* Grid Container matching the Bold Typography spec */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main Hero Stat Section (Col 8) */}
        <section className="md:col-span-8 border border-zinc-800 rounded-2xl bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between min-h-[340px] shadow-2xl relative overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Weekly Output</p>
                <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-[10px] font-bold">
                  <button
                    onClick={() => setOutputMetric('kwh')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${outputMetric === 'kwh' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                  >
                    kW/h
                  </button>
                  <button
                    onClick={() => setOutputMetric('volume')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${outputMetric === 'volume' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                  >
                    Volume
                  </button>
                  <button
                    onClick={() => setOutputMetric('calories')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${outputMetric === 'calories' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                  >
                    Calories
                  </button>
                </div>
              </div>
              <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter leading-none text-white">
                {heroDisplay.value}
                <span className="text-2xl sm:text-3xl font-light text-zinc-500 ml-2">{heroDisplay.unit}</span>
              </h1>
            </div>

            <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{workoutLogs.length > 0 ? `${workoutLogs.length} sessions logged` : 'Ready for session 1'}</span>
            </div>
          </div>

          {/* Interactive Weekly Bar Chart */}
          <div className="mt-8 z-10">
            <div className="flex items-end gap-2 sm:gap-3 h-32 pt-4">
              {weeklyData.map((d, idx) => {
                const isSelected = selectedDayIndex === idx;
                return (
                  <div
                    key={d.day}
                    onClick={() => setSelectedDayIndex(idx)}
                    className="flex-1 flex flex-col items-center gap-2 group/bar cursor-pointer"
                  >
                    <div className="w-full bg-zinc-900 rounded-t-sm h-full flex items-end p-0.5 overflow-hidden">
                      <div
                        style={{ height: `${d.heightPct}%` }}
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          isSelected ? 'bg-white shadow-lg shadow-white/20' : 'bg-zinc-800 group-hover/bar:bg-zinc-700'
                        }`}
                      ></div>
                    </div>
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-white font-black' : 'text-zinc-500'}`}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Column Metrics Stack (Col 4) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Active Streak Card */}
          <section className="border border-zinc-800 rounded-2xl bg-zinc-900/60 p-6 flex flex-col justify-between min-h-[160px] hover:border-zinc-700 transition-colors">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Active Streak</p>
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-4xl font-bold tracking-tight text-white">{vitals.activeStreakDays} Days</p>
              <p className="text-xs text-zinc-400 mt-1">{vitals.activeStreakDays === 0 ? 'Complete a workout to start your streak' : `${vitals.activeStreakDays} day streak active`}</p>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${Math.min(100, (vitals.activeStreakDays / 30) * 100)}%` }}
              ></div>
            </div>
          </section>

          {/* Heart Rate Recovery Card */}
          <section className="border border-zinc-800 rounded-2xl bg-zinc-950 p-6 flex flex-col justify-between min-h-[160px] hover:border-zinc-700 transition-colors">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Heart Rate Recovery</p>
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
              </div>
              <p className="text-4xl font-bold tracking-tight text-white">
                {vitals.heartRateRecoveryBpm} <span className="text-lg font-normal text-zinc-500 italic">bpm</span>
              </p>
              <p className="text-xs text-emerald-400 mt-1">Optimal parasympathetic recovery</p>
            </div>
            <div className="flex items-center gap-1.5 mt-4">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold ml-2">HRV Score: {vitals.recoveryScore}%</span>
            </div>
          </section>
        </div>

        {/* Bottom Row - 3 Cards (Col 4 each) */}
        
        {/* Next Session Launcher */}
        <section className="md:col-span-4 border border-zinc-800 rounded-2xl p-6 bg-gradient-to-br from-zinc-900 to-black flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Next Session</p>
              <span className="text-xs text-zinc-400 font-medium">{nextRoutine ? 'Ready' : 'No routines'}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{nextRoutine?.title || 'Create Your First Routine'}</h3>
            <p className="text-sm text-zinc-400 mb-6">
              {nextRoutine ? `${nextRoutine.durationMinutes} min • ${nextRoutine.subtitle}` : 'Go to Workouts to build a custom routine'}
            </p>
          </div>
          <button
            onClick={() => nextRoutine && onStartWorkout(nextRoutine)}
            disabled={!nextRoutine}
            className={`w-full py-3.5 font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all ${
              nextRoutine 
                ? 'bg-white text-black hover:bg-zinc-200 active:scale-[0.98]'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Play className={`w-4 h-4 ${nextRoutine ? 'fill-black' : ''}`} />
            <span>{nextRoutine ? 'START NOW' : 'NO ROUTINE SET'}</span>
          </button>
        </section>

        {/* Nutrition Goal Ring */}
        <section className="md:col-span-4 border border-zinc-800 rounded-2xl p-6 bg-zinc-950 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nutrition Goal</p>
            <button
              onClick={() => onNavigate('nutrition')}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              Log Meal <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center py-4">
            <ProgressRing
              value={totalCaloriesLogged}
              max={macroTargets.calories}
              size={110}
              strokeWidth={8}
              color="#ffffff"
              label={`${totalCaloriesLogged}`}
              sublabel={`${macroTargets.calories} kcal target`}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-900 text-center">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Protein</p>
              <p className="text-xs font-bold text-white">{totalProteinLogged}/{macroTargets.protein}g</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Carbs</p>
              <p className="text-xs font-bold text-white">{totalCarbsLogged}/{macroTargets.carbs}g</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Fats</p>
              <p className="text-xs font-bold text-white">{totalFatLogged}/{macroTargets.fat}g</p>
            </div>
          </div>
        </section>

        <div className="md:col-span-4 flex flex-col gap-6">
          <section className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950 flex items-center justify-between hover:border-zinc-700 transition-colors cursor-pointer"
                   onClick={() => onNavigate('ai-coach')}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">AI Recovery Insight</span>
                <span className="text-xs text-zinc-400">
                  {vitals.recoveryScore >= 80 
                    ? `High recovery (${vitals.recoveryScore}%) — ready for full intensity`
                    : vitals.recoveryScore >= 60
                    ? `Moderate recovery (${vitals.recoveryScore}%) — consider lighter session`
                    : `Low recovery (${vitals.recoveryScore}%) — rest day recommended`
                  }
                </span>
              </div>
            </div>
            <div className={`w-2.5 h-2.5 rounded-full animate-ping ${
              vitals.recoveryScore >= 80 ? 'bg-emerald-500' : vitals.recoveryScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
            }`}></div>
          </section>

          <section className="border border-zinc-800 rounded-2xl p-6 bg-zinc-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">
                  {vitals.deviceName || 'No Device Connected'}
                </span>
                <span className="text-xs text-zinc-400">
                  {vitals.deviceName ? 'Syncing live biometrics' : 'Connect a wearable to sync data'}
                </span>
              </div>
            </div>
            {vitals.deviceName ? (
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Synced
              </span>
            ) : (
              <span className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-700">
                Offline
              </span>
            )}
          </section>
        </div>

      </div>
    </div>
  );
};
