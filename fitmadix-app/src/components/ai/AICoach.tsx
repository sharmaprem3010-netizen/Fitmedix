import React, { useState } from "react";
import { Sparkles, Dumbbell, Utensils, Send, Plus, Check, Loader2, Bot, User } from "lucide-react";
import { generateAIWorkout, generateAIMealPlan, askAICoach } from "../../services/aiService";
import {
  AIWorkoutPlan,
  AIMealPlan,
  Routine,
  RoutineExercise,
  UserMetrics,
  VitalsData,
} from "../../types/fitness";
import { Button } from "../ui/AppButton";
import { toast } from "sonner";

interface AICoachProps {
  onSaveGeneratedRoutine: (routine: Routine) => void;
  userMetrics?: UserMetrics;
  vitals?: VitalsData;
}

export const AICoach: React.FC<AICoachProps> = ({
  onSaveGeneratedRoutine,
  userMetrics,
  vitals,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"workout" | "meal" | "chat">("workout");

  // Workout Generator Form
  const [workoutGoal, setWorkoutGoal] = useState("Hypertrophy");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [equipment, setEquipment] = useState("Full Gym Barbell & Cables");
  const [targetFocus, setTargetFocus] = useState("Upper / Lower Split");
  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<AIWorkoutPlan | null>(null);
  const [workoutSaved, setWorkoutSaved] = useState(false);

  // Meal Plan Form
  const [calorieTarget, setCalorieTarget] = useState(2400);
  const [dietType, setDietType] = useState("High Protein");
  const [mealGoal, setMealGoal] = useState("Lean Muscle Gain");
  const [allergies, setAllergies] = useState("");
  const [isGeneratingMeal, setIsGeneratingMeal] = useState(false);
  const [generatedMealPlan, setGeneratedMealPlan] = useState<AIMealPlan | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "coach"; text: string }[]>([
    {
      sender: "coach",
      text: "Hello athlete! I am Coach Madix, your AI sports science and conditioning advisor. How can I optimize your workout split, form, or nutrition today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAskingCoach, setIsAskingCoach] = useState(false);

  const handleGenerateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingWorkout(true);
    setWorkoutSaved(false);
    try {
      const result = await generateAIWorkout({
        goal: workoutGoal,
        experienceLevel,
        daysPerWeek,
        equipment,
        targetFocus,
      });
      setGeneratedWorkout(result);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to generate workout. Please try again.",
      );
    } finally {
      setIsGeneratingWorkout(false);
    }
  };

  const handleSaveWorkoutToRoutines = () => {
    if (!generatedWorkout) return;

    const routineExercises: RoutineExercise[] = generatedWorkout.exercises.map((e, i) => ({
      exerciseId: `ai-ex-${i}-${Date.now()}`,
      exerciseName: e.name,
      category: e.category,
      sets: e.sets,
      reps: e.reps,
      restSeconds: e.restSeconds,
    }));

    const routine: Routine = {
      id: `ai-routine-${Date.now()}`,
      title: generatedWorkout.title,
      subtitle: generatedWorkout.summary,
      category: "AI Generated Split",
      durationMinutes: 60,
      targetMuscles: Array.from(new Set(generatedWorkout.exercises.map((e) => e.category))),
      difficulty: experienceLevel as any,
      exercises: routineExercises,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    onSaveGeneratedRoutine(routine);
    setWorkoutSaved(true);
  };

  const handleGenerateMealPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingMeal(true);
    try {
      const result = await generateAIMealPlan({
        calorieTarget,
        dietType,
        goal: mealGoal,
        allergies,
      });
      setGeneratedMealPlan(result);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to generate meal plan. Please try again.",
      );
    } finally {
      setIsGeneratingMeal(false);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAskingCoach) return;

    const userQ = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { sender: "user", text: userQ }]);
    setIsAskingCoach(true);

    try {
      let contextStr = `Goal: ${workoutGoal}, Level: ${experienceLevel}. `;
      if (userMetrics) {
        contextStr += `User: ${userMetrics.age}y ${userMetrics.gender}, ${userMetrics.weightKg}kg, ${userMetrics.heightCm}cm. `;
      }
      if (vitals) {
        contextStr += `Streak: ${vitals.activeStreakDays}d, HRV: ${vitals.recoveryScore}%.`;
      }
      const response = await askAICoach(userQ, contextStr);
      setChatMessages((prev) => [...prev, { sender: "coach", text: response }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { sender: "coach", text: "Sorry, I ran into an issue connecting. Please try again." },
      ]);
    } finally {
      setIsAskingCoach(false);
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Coach Madix AI</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Gemini 3.6 Flash
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Personalized workout routine generation, macro meal plans, and sports science advice
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveSubTab("workout")}
            className={`px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-all ${
              activeSubTab === "workout"
                ? "bg-white text-black shadow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>AI Workout</span>
          </button>
          <button
            onClick={() => setActiveSubTab("meal")}
            className={`px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-all ${
              activeSubTab === "meal"
                ? "bg-white text-black shadow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>AI Meal Plan</span>
          </button>
          <button
            onClick={() => setActiveSubTab("chat")}
            className={`px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-all ${
              activeSubTab === "chat"
                ? "bg-white text-black shadow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Coach Chat</span>
          </button>
        </div>
      </div>

      {/* Mode 1: AI Workout Generator */}
      {activeSubTab === "workout" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Generate Custom Routine</h3>
            <form onSubmit={handleGenerateWorkout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Primary Goal
                </label>
                <select
                  value={workoutGoal}
                  onChange={(e) => setWorkoutGoal(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="Hypertrophy">Hypertrophy (Muscle Growth)</option>
                  <option value="Raw Strength">Raw Strength & Powerlifting</option>
                  <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                  <option value="Athletic Performance">Athletic Performance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Experience
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Days / Week
                  </label>
                  <select
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value={3}>3 Days</option>
                    <option value={4}>4 Days</option>
                    <option value={5}>5 Days</option>
                    <option value={6}>6 Days</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Equipment
                </label>
                <input
                  type="text"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Target Focus
                </label>
                <input
                  type="text"
                  value={targetFocus}
                  onChange={(e) => setTargetFocus(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isGeneratingWorkout}
                className="w-full gap-2 py-3 mt-2"
              >
                {isGeneratingWorkout ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Biometrics & Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Generate AI Routine</span>
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
            {generatedWorkout ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      {generatedWorkout.splitOverview}
                    </span>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
                      {generatedWorkout.title}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">{generatedWorkout.summary}</p>
                  </div>

                  <button
                    onClick={handleSaveWorkoutToRoutines}
                    disabled={workoutSaved}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                      workoutSaved
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-white text-black hover:bg-zinc-200"
                    }`}
                  >
                    {workoutSaved ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Saved to My Routines</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Save to My Routines</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Generated Exercises ({generatedWorkout.exercises.length})
                  </p>
                  {generatedWorkout.exercises.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex justify-between items-start"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">{ex.name}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{ex.reasoning}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-white block">
                          {ex.sets} sets × {ex.reps}
                        </span>
                        <span className="text-[10px] text-zinc-500">Rest {ex.restSeconds}s</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 text-zinc-500">
                <Sparkles className="w-12 h-12 text-zinc-700 mb-3" />
                <p className="text-sm font-bold text-zinc-300">No Routine Generated Yet</p>
                <p className="text-xs max-w-sm mt-1">
                  Fill out your preferences on the left and click "Generate AI Routine" to get an
                  evidence-based split.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: AI Meal Plan Generator */}
      {activeSubTab === "meal" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Generate Sports Meal Plan</h3>
            <form onSubmit={handleGenerateMealPlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Target Calories (kcal)
                </label>
                <input
                  type="number"
                  value={calorieTarget}
                  onChange={(e) => setCalorieTarget(parseInt(e.target.value) || 2000)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Dietary Focus
                </label>
                <select
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="High Protein">High Protein Bodybuilding</option>
                  <option value="Balanced Macro Split">Balanced Macro Split</option>
                  <option value="Ketogenic">Ketogenic / Low Carb</option>
                  <option value="Plant-Based High Protein">Plant-Based / Vegan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Allergies or Dislikes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dairy free, no seafood"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isGeneratingMeal}
                className="w-full gap-2 py-3 mt-2"
              >
                {isGeneratingMeal ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Meal Plan...</span>
                  </>
                ) : (
                  <>
                    <Utensils className="w-4 h-4" />
                    <span>Generate Meal Plan</span>
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            {generatedMealPlan ? (
              <div className="space-y-6">
                <div className="border-b border-zinc-800 pb-4">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    {generatedMealPlan.title}
                  </h2>
                  <div className="flex gap-4 text-xs font-bold text-zinc-400 mt-2">
                    <span>Target: {generatedMealPlan.dailyCalories} kcal</span>
                    <span>P: {generatedMealPlan.macros.protein}g</span>
                    <span>C: {generatedMealPlan.macros.carbs}g</span>
                    <span>F: {generatedMealPlan.macros.fat}g</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {generatedMealPlan.meals.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase text-blue-400">
                          {m.timeSlot} • {m.mealName}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {m.macros.calories} kcal
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">{m.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {m.ingredients.map((ing, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 text-zinc-500">
                <Utensils className="w-12 h-12 text-zinc-700 mb-3" />
                <p className="text-sm font-bold text-zinc-300">No Meal Plan Generated</p>
                <p className="text-xs max-w-sm mt-1">
                  Enter your targets and click "Generate Meal Plan".
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 3: Interactive Coach Chat */}
      {activeSubTab === "chat" && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col h-[520px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "coach" && (
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-white text-black font-medium"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-200"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isAskingCoach && (
              <div className="flex gap-3 items-center text-xs text-zinc-500 italic">
                <Bot className="w-4 h-4 text-blue-400 animate-pulse" />
                <span>Coach Madix is formulating evidence-based answer...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendChatMessage}
            className="mt-4 pt-4 border-t border-zinc-800 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask Coach Madix anything about form, plateau, nutrition, supplements..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
            <Button type="submit" variant="primary" disabled={isAskingCoach}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
