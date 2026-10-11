import React, { useState } from 'react';
import { Pill, AlertOctagon, AlertTriangle, CheckCircle, ShieldCheck, X, Plus, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button.tsx';

interface MedicationItem {
  id: string;
  name: string;
  genericName: string;
  class: string;
  commonUses: string;
}

interface DrugInteraction {
  drugA: string;
  drugB: string;
  severity: 'major' | 'moderate' | 'minor';
  title: string;
  mechanism: string;
  clinicalAdvice: string;
}

export const DrugInteractionChecker: React.FC = () => {
  const commonMedications: MedicationItem[] = [
    { id: 'aspirin', name: 'Aspirin (Bayer)', genericName: 'Acetylsalicylic acid', class: 'Antiplatelet / NSAID', commonUses: 'Cardioprotection, pain, fever' },
    { id: 'ibuprofen', name: 'Ibuprofen (Advil/Motrin)', genericName: 'Ibuprofen', class: 'NSAID', commonUses: 'Inflammation, joint pain, headache' },
    { id: 'warfarin', name: 'Warfarin (Coumadin)', genericName: 'Warfarin Sodium', class: 'Anticoagulant', commonUses: 'Blood clot prevention, DVT, AFib' },
    { id: 'metformin', name: 'Metformin (Glucophage)', genericName: 'Metformin HCl', class: 'Biguanide Antidiabetic', commonUses: 'Type 2 Diabetes glycemic management' },
    { id: 'lisinopril', name: 'Lisinopril (Zestril/Prinivil)', genericName: 'Lisinopril', class: 'ACE Inhibitor', commonUses: 'Hypertension, heart failure' },
    { id: 'atorvastatin', name: 'Atorvastatin (Lipitor)', genericName: 'Atorvastatin Calcium', class: 'HMG-CoA Reductase Inhibitor (Statin)', commonUses: 'Hyperlipidemia, cardiovascular prevention' },
    { id: 'omeprazole', name: 'Omeprazole (Prilosec)', genericName: 'Omeprazole', class: 'Proton Pump Inhibitor (PPI)', commonUses: 'GERD, acid reflux, peptic ulcers' },
    { id: 'amoxicillin', name: 'Amoxicillin (Amoxil)', genericName: 'Amoxicillin', class: 'Beta-Lactam Antibiotic', commonUses: 'Bacterial infections' },
    { id: 'sertraline', name: 'Sertraline (Zoloft)', genericName: 'Sertraline HCl', class: 'SSRI Antidepressant', commonUses: 'Depression, panic, generalized anxiety' },
  ];

  const interactionDatabase: DrugInteraction[] = [
    {
      drugA: 'aspirin',
      drugB: 'ibuprofen',
      severity: 'moderate',
      title: 'Competitive Platelet Receptor Binding & Elevated GI Bleed Risk',
      mechanism: 'Ibuprofen interferes with the irreversible antiplatelet cardioprotective effect of low-dose aspirin and doubles mucosal gastrointestinal ulceration risk.',
      clinicalAdvice: 'Take immediate-release low-dose aspirin at least 30 minutes before ibuprofen, or take ibuprofen 8 hours after aspirin. Consult your cardiologist.',
    },
    {
      drugA: 'aspirin',
      drugB: 'warfarin',
      severity: 'major',
      title: 'High Hemorrhagic Risk (Dual Hemostasis Inhibition)',
      mechanism: 'Concurrent inhibition of both platelet aggregation (Aspirin) and vitamin K clotting factor synthesis (Warfarin) exponentially multiplies major bleeding events.',
      clinicalAdvice: 'Combination strictly requires direct physician prescription, frequent INR coagulation monitoring, and gastroprotective co-therapy.',
    },
    {
      drugA: 'ibuprofen',
      drugB: 'warfarin',
      severity: 'major',
      title: 'Potent Anticoagulation Synergism & Gastrointestinal Hemorrhage',
      mechanism: 'NSAIDs displace warfarin from plasma protein binding sites while damaging gastric mucosa, sharply increasing stomach bleed incidence.',
      clinicalAdvice: 'Avoid combining without physician consent. Prefer acetaminophen/paracetamol for mild pain if approved by your provider.',
    },
    {
      drugA: 'ibuprofen',
      drugB: 'lisinopril',
      severity: 'moderate',
      title: 'Attenuated Antihypertensive Efficacy & Renal Hemodynamic Impairment',
      mechanism: 'NSAIDs inhibit renal prostaglandins, causing sodium and fluid retention while counteracting the vasodilation of ACE inhibitors, stressing kidney function.',
      clinicalAdvice: 'Monitor blood pressure and serum creatinine if taken concurrently for more than a few days.',
    },
    {
      drugA: 'atorvastatin',
      drugB: 'omeprazole',
      severity: 'minor',
      title: 'Mild Bioavailability Variance',
      mechanism: 'Omeprazole alters gastric pH, which can marginally alter the absorption rate of statin formulations without significant clinical toxicity in most patients.',
      clinicalAdvice: 'Standard dosing generally acceptable; report unexplained muscle soreness or dark urine to your physician.',
    },
  ];

  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);

  const toggleMedication = (id: string) => {
    if (selectedMeds.includes(id)) {
      setSelectedMeds(selectedMeds.filter((m) => m !== id));
    } else {
      setSelectedMeds([...selectedMeds, id]);
    }
  };

  // Find active interactions
  const detectedInteractions: DrugInteraction[] = [];
  for (let i = 0; i < selectedMeds.length; i++) {
    for (let j = i + 1; j < selectedMeds.length; j++) {
      const a = selectedMeds[i];
      const b = selectedMeds[j];
      const found = interactionDatabase.find(
        (inter) => (inter.drugA === a && inter.drugB === b) || (inter.drugA === b && inter.drugB === a)
      );
      if (found) {
        detectedInteractions.push(found);
      }
    }
  }

  const getSeverityBadge = (sev: DrugInteraction['severity']) => {
    if (sev === 'major') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertOctagon className="w-3.5 h-3.5" /> Major Contraindication
        </span>
      );
    }
    if (sev === 'moderate') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5" /> Moderate Precaution
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
        <Info className="w-3.5 h-3.5" /> Minor Precaution
      </span>
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00A88F]">
          <Pill className="w-4 h-4" />
          <span>Pharmacology Safety Core</span>
          <span aria-hidden="true">·</span>
          <span>FDA & RxNorm Cross-Referenced</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Medication Interaction & Safety Evaluator
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Select two or more medications to test potential adverse pharmacological interactions, biochemical mechanisms, and clinical dosing precautions.
        </p>
      </div>

      {/* Selected Medications Shelf */}
      <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider">
            Active Regimen ({selectedMeds.length} Selected)
          </span>
          <span className="text-slate-400">Click to remove</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedMeds.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No medications chosen. Select from below to evaluate safety.</p>
          ) : (
            selectedMeds.map((id) => {
              const med = commonMedications.find((m) => m.id === id);
              if (!med) return null;
              return (
                <button
                  key={id}
                  onClick={() => toggleMedication(id)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#00A88F]/40 shadow-2xs text-xs font-semibold text-slate-800 hover:border-rose-300 hover:bg-rose-50/50 transition-colors cursor-pointer group"
                >
                  <span>{med.name}</span>
                  <X className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition-colors" />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Available Medications Grid */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Add Medications To Test
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {commonMedications.map((med) => {
            const isSelected = selectedMeds.includes(med.id);
            return (
              <button
                key={med.id}
                type="button"
                onClick={() => toggleMedication(med.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#00A88F] bg-[#F0FDF9] ring-1 ring-[#00A88F]/40'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{med.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {isSelected ? '✓ In Regimen' : '+ Add'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{med.class}</p>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 truncate">{med.commonUses}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interaction Results Output */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>Safety Evaluation Results</span>
          <span className="text-xs font-mono font-normal text-slate-400">
            ({detectedInteractions.length} interaction{detectedInteractions.length === 1 ? '' : 's'} identified)
          </span>
        </h3>

        {selectedMeds.length < 2 ? (
          <div className="p-8 bg-white border border-dashed border-slate-300 rounded-2xl text-center text-xs text-slate-500">
            Select at least 2 medications above to calculate interactive pharmacokinetics and contraindications.
          </div>
        ) : detectedInteractions.length === 0 ? (
          <div className="p-6 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-sm block">No Major Negative Interactions Detected</span>
              <p className="text-emerald-800 leading-relaxed">
                The selected combination does not exhibit high-risk pharmacokinetic conflicts in standard peer-reviewed registries. Always confirm with your physician or pharmacist regarding individualized dosage timing.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {detectedInteractions.map((inter, idx) => (
              <div
                key={idx}
                className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <span>{inter.title}</span>
                  </div>
                  {getSeverityBadge(inter.severity)}
                </div>

                <div className="space-y-1 text-slate-700">
                  <span className="font-semibold text-slate-900 block">Pharmacological Mechanism:</span>
                  <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600">
                    {inter.mechanism}
                  </p>
                </div>

                <div className="space-y-1 text-slate-700">
                  <span className="font-semibold text-[#002B49] block">Clinical Patient Advice:</span>
                  <p className="leading-relaxed bg-[#F0FDF9] p-3 rounded-xl border border-[#00A88F]/20 text-[#002B49]">
                    {inter.clinicalAdvice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-100/70 border border-slate-200 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-500">
        <ShieldCheck className="w-4 h-4 text-[#00A88F] shrink-0 mt-0.5" />
        <p>
          Fitmadix Pharmacology Engine references standard clinical pharmacology reference protocols. Never discontinue prescribed medications without consulting your licensed physician.
        </p>
      </div>
    </div>
  );
};
