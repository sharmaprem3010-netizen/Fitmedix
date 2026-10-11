import { useState, useEffect, useCallback, useRef } from "react";
import { Exercise } from "@/lib/exercise-data";

export type WorkoutState = "idle" | "exercising" | "resting" | "paused" | "complete";

interface UseWorkoutTimerProps {
  exercises: Exercise[];
  restDurationSeconds: number;
}

export function useWorkoutTimer({ exercises, restDurationSeconds }: UseWorkoutTimerProps) {
  const [state, setState] = useState<WorkoutState>("idle");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Track state before pause to resume correctly
  const [prePauseState, setPrePauseState] = useState<"exercising" | "resting">("exercising");

  const timerRef = useRef<number | null>(null);

  // Audio for beeps (using Web Audio API for better mobile support)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = useCallback((freq = 440, type: OscillatorType = "sine", duration = 0.2) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play failed", e);
    }
  }, []);

  const currentExercise = exercises[currentExerciseIndex];

  const startExercise = useCallback(() => {
    if (currentExerciseIndex >= exercises.length) {
      setState("complete");
      playBeep(880, "triangle", 0.5); // Success sound
      return;
    }

    const ex = exercises[currentExerciseIndex];
    setState("exercising");
    if (ex.duration_seconds) {
      setTimeRemaining(ex.duration_seconds);
    } else {
      setTimeRemaining(0); // Rep based
    }
  }, [currentExerciseIndex, exercises, playBeep]);

  const startRest = useCallback(() => {
    if (currentExerciseIndex >= exercises.length - 1) {
      // Last exercise done, complete workout
      setState("complete");
      playBeep(880, "triangle", 0.5);
    } else {
      setState("resting");
      setTimeRemaining(restDurationSeconds);
    }
  }, [currentExerciseIndex, exercises.length, restDurationSeconds, playBeep]);

  const next = useCallback(() => {
    if (state === "exercising") {
      startRest();
    } else if (state === "resting") {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  }, [state, startRest]);

  const startWorkout = useCallback(() => {
    setCurrentExerciseIndex(0);
    startExercise();
  }, [startExercise]);

  const pause = useCallback(() => {
    if (state === "exercising" || state === "resting") {
      setPrePauseState(state);
      setState("paused");
    }
  }, [state]);

  const resume = useCallback(() => {
    if (state === "paused") {
      setState(prePauseState);
    }
  }, [state, prePauseState]);

  // Main timer loop
  useEffect(() => {
    if (state === "exercising" || state === "resting") {
      // If it's a timed exercise or rest, tick down
      if (timeRemaining > 0) {
        timerRef.current = window.setTimeout(() => {
          setTimeRemaining((prev) => prev - 1);

          // Beeps for last 3 seconds
          if (timeRemaining <= 4 && timeRemaining > 1) {
            playBeep(440, "sine", 0.1);
          } else if (timeRemaining === 1) {
            playBeep(880, "sine", 0.3); // High pitch on zero
          }
        }, 1000);
      } else if (timeRemaining === 0) {
        // Auto-advance if time is up (for timed exercises or rest)
        if (state === "resting" || (state === "exercising" && currentExercise?.duration_seconds)) {
          next();
        }
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state, timeRemaining, next, currentExercise, playBeep]);

  // When index changes, start the new exercise (if transitioning from rest)
  useEffect(() => {
    if (state === "resting" || state === "idle" || state === "complete") {
      // Handled by startWorkout or next()
    } else {
      startExercise();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExerciseIndex]);

  const progress =
    ((currentExerciseIndex + (state === "resting" ? 1 : 0)) / exercises.length) * 100;

  return {
    state,
    currentExercise,
    currentExerciseIndex,
    timeRemaining,
    progress,
    totalExercises: exercises.length,
    startWorkout,
    pause,
    resume,
    next, // Used to skip rest or manually complete rep-based exercise
  };
}
