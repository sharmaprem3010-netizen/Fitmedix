import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Check,
  ArrowRight,
  RotateCcw,
  Award,
  Clock,
  Flame,
  Dumbbell,
  X,
} from "lucide-react";
import { Routine, WorkoutSessionLog, ExerciseLog, SetLog } from "../../types/fitness";
import { estimateCalorieBurn, calculateOneRepMax } from "../../utils/calculators";
import { useAccessibility } from "../AccessibilityProvider";

interface LiveWorkoutSessionProps {
  routine: Routine;
  onFinishWorkout: (log: WorkoutSessionLog) => void;
  onCancelWorkout: () => void;
}

export const LiveWorkoutSession: React.FC<LiveWorkoutSessionProps> = ({
  routine,
  onFinishWorkout,
  onCancelWorkout,
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  const { autoSpeak, language, setLocalCommandHandler, simpleMode } = useAccessibility();

  // Rest Timer State
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null);

  // Exercise set logs state
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>(() => {
    return routine.exercises.map((ex) => {
      const sets: SetLog[] = Array.from({ length: ex.sets }).map((_, i) => ({
        setNumber: i + 1,
        weightKg: ex.targetWeightKg || 20,
        reps: parseInt(ex.reps.split("-")[0]) || 10,
        completed: false,
      }));
      return {
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        sets,
      };
    });
  });

  // Workout duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Rest Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restSecondsRemaining !== null && restSecondsRemaining > 0) {
      interval = setInterval(() => {
        setRestSecondsRemaining((prev) => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restSecondsRemaining]);

  const currentExercise = routine.exercises[currentExerciseIndex];
  const currentLog = exerciseLogs[currentExerciseIndex];

  // Voice Intro for Current Exercise
  useEffect(() => {
    const txt = language.startsWith("en") ? `Next exercise: ${currentExercise.exerciseName}, ${currentExercise.sets} sets of ${currentExercise.reps}.`
              : language.startsWith("hi") ? `अगला व्यायाम: ${currentExercise.exerciseName}`
              : `পরবর্তী ব্যায়াম: ${currentExercise.exerciseName}`;
    autoSpeak(txt);
  }, [currentExerciseIndex, language, autoSpeak]);

  // Voice Command Handler
  useEffect(() => {
    setLocalCommandHandler((text: string) => {
      const lower = text.toLowerCase();
      
      if (/(next|agla|পরবর্তী)/.test(lower)) {
        if (currentExerciseIndex < routine.exercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
        }
        return true;
      }
      
      if (/(pause|ruk|थामুন)/.test(lower)) {
        setIsTimerRunning(false);
        autoSpeak(language.startsWith("en") ? "Workout paused." : "कसरत रोक दी गई है।");
        return true;
      }

      if (/(resume|start|shuru|start workout)/.test(lower)) {
        setIsTimerRunning(true);
        autoSpeak(language.startsWith("en") ? "Workout resumed." : "कसरत फिर से शुरू।");
        return true;
      }

      if (/(finish|stop|complete)/.test(lower)) {
        handleFinish();
        return true;
      }
      
      if (/(cancel|abort|radd|বাতিল)/.test(lower)) {
        onCancelWorkout();
        autoSpeak(language.startsWith("en") ? "Workout cancelled." : "कसरत रद्द की गई।");
        return true;
      }

      if (/(done|complete set|ho gaya)/.test(lower)) {
        // Find first incomplete set
        const incompleteSetIdx = currentLog.sets.findIndex(s => !s.completed);
        if (incompleteSetIdx !== -1) {
          handleToggleSetComplete(incompleteSetIdx);
          autoSpeak(language.startsWith("en") ? "Set marked as complete. Rest now." : "सेट पूरा हुआ। आराम करें।");
        }
        return true;
      }

      return false;
    });

    return () => setLocalCommandHandler(null);
  }, [setLocalCommandHandler, currentExerciseIndex, routine.exercises.length, currentLog, language, autoSpeak, onCancelWorkout]);

  const handleToggleSetComplete = (setIndex: number) => {
    setExerciseLogs((prev) => {
      const updated = [...prev];
      const targetEx = { ...updated[currentExerciseIndex] };
      const sets = [...targetEx.sets];
      const wasCompleted = sets[setIndex].completed;
      sets[setIndex] = { ...sets[setIndex], completed: !wasCompleted };
      targetEx.sets = sets;
      updated[currentExerciseIndex] = targetEx;
      return updated;
    });

    // If marked as completed, trigger rest timer
    if (!currentLog.sets[setIndex].completed) {
      setRestSecondsRemaining(currentExercise.restSeconds || 60);
    }
  };

  const handleUpdateSetWeight = (setIndex: number, weight: number) => {
    setExerciseLogs((prev) => {
      const updated = [...prev];
      const targetEx = { ...updated[currentExerciseIndex] };
      const sets = [...targetEx.sets];
      sets[setIndex] = { ...sets[setIndex], weightKg: Math.max(0, weight) };
      targetEx.sets = sets;
      updated[currentExerciseIndex] = targetEx;
      return updated;
    });
  };

  const handleUpdateSetReps = (setIndex: number, reps: number) => {
    setExerciseLogs((prev) => {
      const updated = [...prev];
      const targetEx = { ...updated[currentExerciseIndex] };
      const sets = [...targetEx.sets];
      sets[setIndex] = { ...sets[setIndex], reps: Math.max(0, reps) };
      targetEx.sets = sets;
      updated[currentExerciseIndex] = targetEx;
      return updated;
    });
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  // Calculate stats
  const totalVolume = exerciseLogs.reduce((acc, ex) => {
    return (
      acc +
      ex.sets.reduce((sAcc, set) => (set.completed ? sAcc + set.weightKg * set.reps : sAcc), 0)
    );
  }, 0);

  const completedSetsCount = exerciseLogs.reduce((acc, ex) => {
    return acc + ex.sets.filter((s) => s.completed).length;
  }, 0);

  const handleFinish = () => {
    const caloriesBurned = estimateCalorieBurn(Math.ceil(elapsedSeconds / 60));
    const sessionLog: WorkoutSessionLog = {
      id: `session-${Date.now()}`,
      routineId: routine.id,
      routineTitle: routine.title,
      startTime: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      totalVolumeKg: totalVolume,
      caloriesBurnedEstimate: caloriesBurned,
      exerciseLogs,
      completed: true,
    };
    
    autoSpeak(language.startsWith("en") ? "Workout finished. Great job!" : language.startsWith("hi") ? "कसरत पूरी हुई। बहुत बढ़िया!" : "ব্যায়াম শেষ। দারুণ কাজ!");
    
    onFinishWorkout(sessionLog);
  };

  if (simpleMode) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-y-auto text-foreground animate-fade-in pb-32">
        <header className="p-6 border-b-4 border-border flex flex-col items-center gap-4">
          <h2 className="text-4xl font-bold text-center">{routine.title}</h2>
          <div className="text-5xl font-mono font-bold text-primary">{formatTime(elapsedSeconds)}</div>
          
          <div className="flex gap-4 w-full max-w-sm mt-4">
            <button
              onClick={onCancelWorkout}
              className="flex-1 py-4 text-2xl font-bold bg-rose-500/10 text-rose-500 border-4 border-rose-500/50 rounded-2xl"
            >
              Cancel
            </button>
            <button
              onClick={handleFinish}
              className="flex-1 py-4 text-2xl font-bold bg-emerald-500 text-black border-4 border-emerald-600 rounded-2xl"
            >
              Finish
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 flex flex-col items-center">
          <h3 className="text-3xl font-bold mb-8 text-center">{currentExercise.exerciseName}</h3>
          
          <div className="w-full max-w-md space-y-4">
            {currentLog.sets.map((set, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handleToggleSetComplete(sIdx)}
                className={`w-full p-6 flex items-center justify-between rounded-3xl border-4 transition-all ${
                  set.completed 
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-600" 
                    : "bg-card border-border hover:border-primary"
                }`}
              >
                <div className="text-left">
                  <div className="text-xl font-bold text-muted-foreground">Set {set.setNumber}</div>
                  <div className="text-3xl font-bold mt-2">{set.reps} reps</div>
                </div>
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${set.completed ? "border-emerald-500 bg-emerald-500 text-black" : "border-muted-foreground text-transparent"}`}>
                  <Check className="w-10 h-10" />
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4 mt-12 w-full max-w-md">
            <button
              onClick={() => setCurrentExerciseIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentExerciseIndex === 0}
              className="flex-1 py-6 text-2xl font-bold bg-secondary border-4 border-border rounded-3xl disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={() =>
                setCurrentExerciseIndex((prev) => Math.min(routine.exercises.length - 1, prev + 1))
              }
              disabled={currentExerciseIndex === routine.exercises.length - 1}
              className="flex-1 py-6 text-2xl font-bold bg-primary text-primary-foreground border-4 border-primary rounded-3xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden text-white animate-fade-in">
      {/* Top Header */}
      <header className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between bg-zinc-950 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <h2 className="text-base font-bold tracking-tight">{routine.title}</h2>
            <p className="text-xs text-zinc-400">Live Session Logging</p>
          </div>
        </div>

        {/* Live Timer & Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-300">
            <Dumbbell className="w-3.5 h-3.5 text-zinc-400" />
            <span>{totalVolume.toLocaleString()} kg</span>
          </div>

          <button
            onClick={handleFinish}
            className="px-4 py-2 bg-white text-black font-bold text-xs rounded-lg hover:bg-zinc-200 cursor-pointer transition-transform active:scale-95"
          >
            FINISH SESSION
          </button>

          <button
            onClick={onCancelWorkout}
            className="p-2 hover:bg-zinc-900 text-zinc-500 hover:text-white rounded-lg cursor-pointer"
            title="Cancel Workout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Exercise List Rail */}
        <div className="w-full md:w-72 border-r border-zinc-800 bg-zinc-950 p-4 overflow-y-auto shrink-0 flex flex-row md:flex-col gap-2">
          {routine.exercises.map((ex, idx) => {
            const isCurrent = idx === currentExerciseIndex;
            const exLog = exerciseLogs[idx];
            const isCompleted = exLog.sets.every((s) => s.completed);

            return (
              <button
                key={ex.exerciseId}
                onClick={() => setCurrentExerciseIndex(idx)}
                className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? "bg-zinc-800 border-zinc-600 text-white shadow-lg"
                    : "bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <div>
                  <p className="text-xs font-bold tracking-tight">{ex.exerciseName}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {ex.sets} Sets × {ex.reps}
                  </p>
                </div>
                {isCompleted && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Center Main Set Tracker */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div>
            {/* Exercise Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Exercise {currentExerciseIndex + 1} of {routine.exercises.length} •{" "}
                  {currentExercise.category}
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                  {currentExercise.exerciseName}
                </h1>
              </div>

              {/* Rest Timer Widget */}
              {restSecondsRemaining !== null && (
                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-xl flex items-center gap-3 animate-pulse">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-bold font-mono">Rest: {restSecondsRemaining}s</span>
                  <button
                    onClick={() => setRestSecondsRemaining(null)}
                    className="text-xs underline cursor-pointer text-zinc-400 hover:text-white"
                  >
                    Skip
                  </button>
                </div>
              )}
            </div>

            {/* Set Table */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-12 gap-2 px-6 py-3 border-b border-zinc-800 text-[11px] font-bold uppercase text-zinc-500 tracking-wider">
                <span className="col-span-2">Set</span>
                <span className="col-span-4">Weight (kg)</span>
                <span className="col-span-4">Reps</span>
                <span className="col-span-2 text-right">Status</span>
              </div>

              <div className="divide-y divide-zinc-900">
                {currentLog.sets.map((set, sIdx) => {
                  return (
                    <div
                      key={sIdx}
                      className={`grid grid-cols-12 gap-2 px-6 py-3.5 items-center transition-colors ${
                        set.completed ? "bg-emerald-950/20" : "hover:bg-zinc-900/50"
                      }`}
                    >
                      <span className="col-span-2 text-sm font-bold text-zinc-400">
                        #{set.setNumber}
                      </span>

                      {/* Weight Input */}
                      <div className="col-span-4 flex items-center gap-2">
                        <input
                          type="number"
                          value={set.weightKg}
                          onChange={(e) =>
                            handleUpdateSetWeight(sIdx, parseFloat(e.target.value) || 0)
                          }
                          className="w-20 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-bold text-white text-center focus:outline-none focus:ring-2 focus:ring-zinc-600"
                        />
                        <span className="text-xs text-zinc-500 hidden sm:inline">kg</span>
                      </div>

                      {/* Reps Input */}
                      <div className="col-span-4 flex items-center gap-2">
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleUpdateSetReps(sIdx, parseInt(e.target.value) || 0)}
                          className="w-20 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-bold text-white text-center focus:outline-none focus:ring-2 focus:ring-zinc-600"
                        />
                        <span className="text-xs text-zinc-500 hidden sm:inline">reps</span>
                      </div>

                      {/* Toggle Complete Checkbox */}
                      <div className="col-span-2 flex justify-end">
                        <button
                          onClick={() => handleToggleSetComplete(sIdx)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                            set.completed
                              ? "bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20"
                              : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700"
                          }`}
                        >
                          <Check className="w-5 h-5 stroke-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Exercise Nav Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
            <button
              onClick={() => setCurrentExerciseIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentExerciseIndex === 0}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-300 disabled:opacity-30 cursor-pointer"
            >
              Previous Exercise
            </button>

            {currentExerciseIndex < routine.exercises.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentExerciseIndex((prev) =>
                    Math.min(routine.exercises.length - 1, prev + 1),
                  )
                }
                className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Next Exercise</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 bg-emerald-500 text-black hover:bg-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>FINISH WORKOUT</span>
                <Check className="w-4 h-4 stroke-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
