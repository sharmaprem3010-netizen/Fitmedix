import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Heart,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Plus,
  RefreshCw,
  Sparkles,
  Info,
  Calendar,
  Clock,
  Volume2,
  Bot,
} from 'lucide-react';
import { userHealthSummaryService, BPCategory, BloodPressureReading } from '../../services/health-dashboard/healthSummaryService.ts';
import { aiService } from '../../services/ai/aiService.ts';
import { useAuth } from '../authentication/AuthContext.tsx';
import { useVoice } from '../voice/VoiceContext.tsx';

interface BPCategoryDetail {
  category: BPCategory;
  color: string;
  badgeBg: string;
  borderCol: string;
  description: string;
  clinicalImplication: string;
  actionAdvice: string;
}

const BP_CATEGORY_MAP: Record<BPCategory, BPCategoryDetail> = {
  Normal: {
    category: 'Normal',
    color: 'text-emerald-700',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderCol: 'border-emerald-500',
    description: 'Systolic under 120 mmHg AND Diastolic under 80 mmHg.',
    clinicalImplication: 'Healthy cardiovascular pressure. Low risk of arterial wall shear stress and adverse vascular events.',
    actionAdvice: 'Maintain healthy heart habits: balanced diet rich in whole foods, regular physical exercise, and stress management.',
  },
  Elevated: {
    category: 'Elevated',
    color: 'text-amber-700',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    borderCol: 'border-amber-400',
    description: 'Systolic 120–129 mmHg AND Diastolic under 80 mmHg.',
    clinicalImplication: 'Early vascular tension without clinical hypertension. Indicates progressive arterial stiffness if unaddressed.',
    actionAdvice: 'Adopt the DASH dietary pattern (low sodium, high potassium), engage in 150 min/week Zone 2 aerobic cardio, and limit alcohol.',
  },
  'Stage 1 Hypertension': {
    category: 'Stage 1 Hypertension',
    color: 'text-orange-700',
    badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
    borderCol: 'border-orange-500',
    description: 'Systolic 130–139 mmHg OR Diastolic 80–89 mmHg.',
    clinicalImplication: 'Early clinical hypertension. Elevated risk of long-term endothelial dysfunction, microvascular damage, and cardiac strain.',
    actionAdvice: 'Consult your physician. Focus on sodium restriction (<1,500 mg/day), aerobic exercise, weight management, and home monitoring.',
  },
  'Stage 2 Hypertension': {
    category: 'Stage 2 Hypertension',
    color: 'text-rose-700',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    borderCol: 'border-rose-500',
    description: 'Systolic 140 mmHg or higher OR Diastolic 90 mmHg or higher.',
    clinicalImplication: 'Moderate-to-severe arterial wall tension requiring active medical management to prevent heart attack, stroke, or kidney disease.',
    actionAdvice: 'Schedule a prompt medical appointment. In addition to lifestyle changes, licensed physicians typically prescribe anti-hypertensive therapy.',
  },
  'Hypertensive Crisis': {
    category: 'Hypertensive Crisis',
    color: 'text-red-700',
    badgeBg: 'bg-red-100 text-red-900 border-red-300',
    borderCol: 'border-red-600',
    description: 'Systolic exceeding 180 mmHg AND/OR Diastolic exceeding 120 mmHg.',
    clinicalImplication: 'Extremely dangerous hemodynamic pressure with risk of acute organ damage (retinal hemorrhage, encephalopathy, myocardial infarction).',
    actionAdvice: 'URGENT: Recheck after 5 minutes of rest. If still elevated or accompanied by chest pain, shortness of breath, or headache, contact 911 / emergency services immediately.',
  },
};

export const BloodPressureAnalyzer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { speak, isVoiceMode } = useVoice();
  const userId = user?.id || 'guest';

  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [pulse, setPulse] = useState<number>(72);
  const [arm, setArm] = useState<'left' | 'right'>('left');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiSources, setAiSources] = useState<string[]>([]);
  const [aiFollowUps, setAiFollowUps] = useState<string[]>([]);

  // Compute current classification
  const currentCategory = userHealthSummaryService.classifyBloodPressure(systolic, diastolic);
  const categoryDetail = BP_CATEGORY_MAP[currentCategory];

  const presets = [
    { label: '118/76 (Normal Baseline)', sys: 118, dia: 76 },
    { label: '124/78 (Elevated)', sys: 124, dia: 78 },
    { label: '134/84 (Stage 1 HTN)', sys: 134, dia: 84 },
    { label: '144/92 (Stage 2 HTN)', sys: 144, dia: 92 },
    { label: '185/122 (Crisis Alert)', sys: 185, dia: 122 },
  ];

  const handleApplyPreset = (sys: number, dia: number) => {
    setSystolic(sys);
    setDiastolic(dia);
    // If AI analysis was already rendered, reset to encourage re-eval
    if (aiAnalysis) setAiAnalysis(null);
  };

  const handleSaveToDashboard = () => {
    userHealthSummaryService.logBloodPressure(userId, systolic, diastolic, pulse, arm, 'Analyzed via BP Clinical Tool');
    setSaveSuccess(true);
    if (isVoiceMode) {
      speak(`Logged Blood Pressure reading: ${systolic} over ${diastolic} mmHg. Category is ${currentCategory}.`);
    }
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleRunInlineAI = async () => {
    setIsAnalyzing(true);
    try {
      const res = await aiService.queryAssistant({
        prompt: `My blood pressure reading is ${systolic}/${diastolic} mmHg with a pulse of ${pulse} BPM measured on my ${arm} arm. What is the clinical interpretation, hemodynamic impact, and evidence-backed guidance according to AHA/ACC guidelines?`,
        domain: 'health-education',
      });
      setAiAnalysis(res.answer);
      setAiSources(res.sources || ['American Heart Association (AHA)', 'American College of Cardiology (ACC)']);
      setAiFollowUps(res.suggestedFollowUps || []);
      if (isVoiceMode) {
        speak(res.answer.slice(0, 250));
      }
    } catch {
      setAiAnalysis('Unable to load AI analysis at this moment. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConsultAI = () => {
    navigate('/ai', {
      state: {
        initialQuery: `My blood pressure reading is ${systolic}/${diastolic} mmHg with a pulse of ${pulse} BPM measured on my ${arm} arm. What is the clinical significance and evidence-backed guidance according to AHA guidelines?`,
      },
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Tool Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00A88F]">
          <Activity className="w-4 h-4" />
          <span>Cardiovascular Diagnostics</span>
          <span aria-hidden="true">·</span>
          <span>AHA/ACC Clinical Standards</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#002B49]">
          Blood Pressure (BP) Clinical Analyzer & Tracker
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Evaluate systolic and diastolic hemodynamic readings against verified American Heart Association standards, interpret vascular tension, and track readings to your dashboard.
        </p>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        {/* Left Column: Interactive Input Controls */}
        <div className="lg:col-span-5 min-w-0 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>Input BP Measurement</span>
            <span className="text-[11px] font-mono text-slate-400">Unit: mmHg</span>
          </h3>

          {/* Quick Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
              Quick Test Presets:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(p.sys, p.dia)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-medium border transition-colors cursor-pointer ${
                    systolic === p.sys && diastolic === p.dia
                      ? 'bg-[#002B49] text-white border-[#002B49]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Systolic Slider & Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="sys-input" className="text-xs font-bold text-slate-800">
                Systolic Pressure (Upper Number)
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="sys-input"
                  type="number"
                  min="70"
                  max="240"
                  value={systolic}
                  onChange={(e) => setSystolic(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-right font-mono font-black text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A88F]"
                />
                <span className="text-xs text-slate-400 font-mono">mmHg</span>
              </div>
            </div>
            <input
              type="range"
              min="80"
              max="220"
              value={systolic}
              onChange={(e) => setSystolic(Number(e.target.value))}
              className="w-full accent-[#00A88F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>80 (Low)</span>
              <span>120 (Target)</span>
              <span>140 (HTN)</span>
              <span>200+ (Crisis)</span>
            </div>
          </div>

          {/* Diastolic Slider & Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="dia-input" className="text-xs font-bold text-slate-800">
                Diastolic Pressure (Lower Number)
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="dia-input"
                  type="number"
                  min="40"
                  max="140"
                  value={diastolic}
                  onChange={(e) => setDiastolic(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-right font-mono font-black text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A88F]"
                />
                <span className="text-xs text-slate-400 font-mono">mmHg</span>
              </div>
            </div>
            <input
              type="range"
              min="50"
              max="130"
              value={diastolic}
              onChange={(e) => setDiastolic(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50 (Low)</span>
              <span>80 (Target)</span>
              <span>90 (HTN)</span>
              <span>120+ (Crisis)</span>
            </div>
          </div>

          {/* Pulse and Arm Selection */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
            <div>
              <label htmlFor="pulse-input" className="text-xs font-semibold text-slate-600 block mb-1">
                Heart Rate (BPM)
              </label>
              <input
                id="pulse-input"
                type="number"
                min="40"
                max="180"
                value={pulse}
                onChange={(e) => setPulse(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A88F]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Measurement Arm
              </label>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setArm('left')}
                  className={`flex-1 py-1.5 font-bold transition-colors cursor-pointer ${
                    arm === 'left' ? 'bg-[#002B49] text-white' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => setArm('right')}
                  className={`flex-1 py-1.5 font-bold transition-colors cursor-pointer ${
                    arm === 'right' ? 'bg-[#002B49] text-white' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  Right
                </button>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={handleSaveToDashboard}
              className="w-full sm:flex-1 py-2.5 px-4 text-xs font-bold text-white bg-[#00A88F] hover:bg-[#00947D] active:bg-[#007D69] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log to Health Dashboard</span>
            </button>

            <button
              onClick={handleRunInlineAI}
              disabled={isAnalyzing}
              className="w-full sm:flex-1 py-2.5 px-4 text-xs font-bold text-[#002B49] bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-[#00A88F]/40 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              title="Get instant AI clinical evaluation right here"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-[#00A88F] animate-spin" />
                  <span>Analyzing BP...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#00A88F]" />
                  <span>Instant AI Analysis</span>
                </>
              )}
            </button>

            <button
              onClick={handleConsultAI}
              className="w-full sm:w-auto py-2.5 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Open query in AI Assistant chat page"
            >
              <Bot className="w-3.5 h-3.5 text-slate-500" />
              <span>Full Chat</span>
            </button>
          </div>

          {saveSuccess && (
            <div role="status" className="p-2.5 bg-[#F0FDF9] border border-[#00A88F]/40 text-[#002B49] rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#00A88F] shrink-0" />
              <span>Logged {systolic}/{diastolic} mmHg to your private health profile!</span>
            </div>
          )}
        </div>

        {/* Right Column: Clinical Classification & Actionable Insights */}
        <div className="lg:col-span-7 min-w-0 space-y-5">
          {/* Classification Banner */}
          <div className={`p-4 sm:p-6 rounded-2xl border-2 ${categoryDetail.borderCol} bg-white shadow-sm space-y-4 min-w-0`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  AHA Diagnostic Tier
                </span>
                <div className="flex items-center gap-2.5 mt-0.5">
                  <h3 className={`text-xl font-black ${categoryDetail.color}`}>
                    {categoryDetail.category}
                  </h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${categoryDetail.badgeBg}`}>
                    {systolic}/{diastolic} mmHg
                  </span>
                </div>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-[10px] font-mono text-slate-400 block">Mean Arterial Pressure (MAP)</span>
                <span className="text-base font-black font-mono text-slate-800">
                  {Math.round(diastolic + (systolic - diastolic) / 3)} mmHg
                </span>
              </div>
            </div>

            {/* Physiological & Clinical Implications */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-slate-800 block flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#00A88F]" />
                  Physiological Interpretation:
                </span>
                <p className="text-slate-600">{categoryDetail.clinicalImplication}</p>
              </div>

              <div className="p-3 bg-[#F0FDF9] rounded-xl border border-[#00A88F]/30 space-y-1">
                <span className="font-bold text-[#002B49] block flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00A88F]" />
                  Actionable Medical Recommendations:
                </span>
                <p className="text-slate-700">{categoryDetail.actionAdvice}</p>
              </div>
            </div>
          </div>

          {/* Instant AI Hemodynamic Analysis Card */}
          {isAnalyzing && (
            <div className="p-6 bg-white border border-[#00A88F]/40 rounded-2xl shadow-xs space-y-3 animate-pulse">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00A88F]">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Consulting Gemini Clinical Cardiology Intelligence for {systolic}/{diastolic} mmHg...</span>
              </div>
              <div className="w-3/4 h-3 bg-slate-200 rounded" />
              <div className="w-5/6 h-3 bg-slate-200 rounded" />
              <div className="w-1/2 h-3 bg-slate-200 rounded" />
            </div>
          )}

          {aiAnalysis && !isAnalyzing && (
            <div className="p-6 bg-white border-2 border-[#00A88F]/60 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00A88F]" />
                  <h4 className="text-sm font-bold text-[#002B49]">
                    AI Clinical Hemodynamic Evaluation
                  </h4>
                  <span className="text-[10px] font-bold text-[#00A88F] bg-[#F0FDF9] px-2 py-0.5 rounded-full border border-[#00A88F]/30">
                    AHA Grounded
                  </span>
                </div>
                <button
                  onClick={() => speak(aiAnalysis)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#00A88F] hover:underline cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Read Aloud</span>
                </button>
              </div>

              <div className="text-slate-800 text-xs leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                {aiAnalysis}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div className="flex flex-wrap items-center gap-1 text-slate-500">
                  <span className="font-semibold text-slate-600">Clinical Sources:</span>
                  {aiSources.map((s, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleConsultAI}
                  className="text-[#00A88F] hover:text-[#002B49] font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Continue in AI Assistant</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Reference Scale Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>American Heart Association (AHA) BP Categories</span>
              <span className="text-[10px] text-slate-400 font-normal">Official Guidelines</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                currentCategory === 'Normal' ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Normal</span>
                </div>
                <span className="font-mono text-[11px]">&lt; 120 / &lt; 80 mmHg</span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                currentCategory === 'Elevated' ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-400 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Elevated</span>
                </div>
                <span className="font-mono text-[11px]">120–129 / &lt; 80 mmHg</span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                currentCategory === 'Stage 1 Hypertension' ? 'bg-orange-50/80 border-orange-300 ring-1 ring-orange-400 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>Stage 1 Hypertension</span>
                </div>
                <span className="font-mono text-[11px]">130–139 / 80–89 mmHg</span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                currentCategory === 'Stage 2 Hypertension' ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-400 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Stage 2 Hypertension</span>
                </div>
                <span className="font-mono text-[11px]">≥ 140 / ≥ 90 mmHg</span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                currentCategory === 'Hypertensive Crisis' ? 'bg-red-100 border-red-400 ring-1 ring-red-500 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span>Hypertensive Crisis</span>
                </div>
                <span className="font-mono text-[11px] text-red-700">&gt; 180 / &gt; 120 mmHg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
