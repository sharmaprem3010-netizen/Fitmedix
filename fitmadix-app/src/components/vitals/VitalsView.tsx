import React from "react";
import { Activity, Heart, Moon, Zap, Cpu, RefreshCw, CheckCircle2 } from "lucide-react";
import { VitalsData } from "../../types/fitness";
import { Card } from "../ui/AppCard";
import { Badge } from "../ui/AppBadge";

interface VitalsViewProps {
  vitals: VitalsData;
}

export const VitalsView: React.FC<VitalsViewProps> = ({ vitals }) => {
  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Wearable Vitals & Biometrics
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time biometric sync, sleep quality index, and autonomic recovery scores
          </p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl text-xs text-zinc-300">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">{vitals.deviceName}</span>
          <span className="text-emerald-400 font-mono text-[10px] ml-1">● Synced</span>
        </div>
      </div>

      {/* Grid of Biometrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Recovery Score */}
        <Card variant="dark" className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Recovery Score
              </span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-5xl font-extrabold text-white tracking-tight">
              {vitals.recoveryScore}%
            </p>
            <p className="text-xs text-emerald-400 mt-2 font-medium">
              Prime condition for intense strength training
            </p>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-6">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${vitals.recoveryScore}%` }}
            ></div>
          </div>
        </Card>

        {/* Sleep Score */}
        <Card variant="dark" className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Sleep Score
              </span>
              <Moon className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-5xl font-extrabold text-white tracking-tight">
              {vitals.sleepScore}
              <span className="text-lg font-normal text-zinc-500">/100</span>
            </p>
            <p className="text-xs text-zinc-400 mt-2">7h 48m total • 1h 52m REM & Deep sleep</p>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-6">
            <div className="h-full bg-blue-500" style={{ width: `${vitals.sleepScore}%` }}></div>
          </div>
        </Card>

        {/* Strain Score */}
        <Card variant="dark" className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Daily Strain
              </span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-5xl font-extrabold text-white tracking-tight">
              {vitals.strainScore}
              <span className="text-lg font-normal text-zinc-500">/21</span>
            </p>
            <p className="text-xs text-amber-400 mt-2">Optimal progressive overload range</p>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-6">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${(vitals.strainScore / 21) * 100}%` }}
            ></div>
          </div>
        </Card>

        {/* Resting Heart Rate */}
        <Card variant="dark" className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Resting HR
              </span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-5xl font-extrabold text-white tracking-tight">
              {vitals.restingHeartRateBpm}
              <span className="text-lg font-normal text-zinc-500"> bpm</span>
            </p>
            <p className="text-xs text-zinc-400 mt-2">2 bpm below baseline average</p>
          </div>
          <div className="flex items-center gap-1 mt-6">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] uppercase font-bold text-zinc-400">
              Cardiovascular Baseline Normal
            </span>
          </div>
        </Card>
      </div>

      {/* Sensor Calibration Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">FitMadix Vitals 4.0 Pro Sensor Mesh</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Photoplethysmography (PPG) optical heart rate, skin temperature sensor, and 3-axis
            accelerometer
          </p>
        </div>

        <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Force Sensor Resync</span>
        </button>
      </div>
    </div>
  );
};
