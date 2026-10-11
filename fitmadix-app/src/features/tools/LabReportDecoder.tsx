import React, { useState } from 'react';
import { FileText, Info, HelpCircle, CheckCircle2, AlertTriangle, ArrowRight, Activity, Edit3 } from 'lucide-react';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';

interface LabBiomarker {
  name: string;
  code: string;
  unit: string;
  minNormal: number;
  maxNormal: number;
  lowAlert: number;
  highAlert: number;
  category: string;
  meaning: string;
  clinicalSignificance: string;
  questionsForDoctor: string;
}

interface LabPanel {
  id: string;
  title: string;
  description: string;
  standardSources: string;
  biomarkers: LabBiomarker[];
}

export const LabReportDecoder: React.FC = () => {
  const panels: LabPanel[] = [
    {
      id: 'lipid',
      title: 'Lipid Cardiovascular Panel',
      description: 'Standard cardiovascular risk profile measuring cholesterol particles and circulating triglycerides.',
      standardSources: 'American Heart Association (AHA) & National Cholesterol Education Program (NCEP)',
      biomarkers: [
        {
          name: 'Total Cholesterol',
          code: 'TC',
          unit: 'mg/dL',
          minNormal: 125,
          maxNormal: 200,
          lowAlert: 100,
          highAlert: 240,
          category: 'Cardiovascular',
          meaning: 'Total amount of circulating cholesterol molecules across all lipoprotein classes in serum.',
          clinicalSignificance: 'Desirable level is below 200 mg/dL. Elevated readings warrant evaluating LDL and HDL ratios.',
          questionsForDoctor: 'How does my total cholesterol relate to my overall 10-year ASCVD cardiovascular risk score?',
        },
        {
          name: 'LDL Cholesterol ("Bad")',
          code: 'LDL-C',
          unit: 'mg/dL',
          minNormal: 50,
          maxNormal: 100,
          lowAlert: 40,
          highAlert: 160,
          category: 'Cardiovascular',
          meaning: 'Low-density lipoprotein that deposits excess cholesterol into arterial walls, forming plaques.',
          clinicalSignificance: 'Optimal is below 100 mg/dL (<70 mg/dL for high cardiac risk). Mild elevations often respond to dietary soluble fiber and saturated fat reduction.',
          questionsForDoctor: 'Should we prioritize dietary changes or consider medication based on my family history?',
        },
        {
          name: 'HDL Cholesterol ("Good")',
          code: 'HDL-C',
          unit: 'mg/dL',
          minNormal: 40,
          maxNormal: 80,
          lowAlert: 35,
          highAlert: 90,
          category: 'Cardiovascular',
          meaning: 'High-density lipoprotein that clears surplus cholesterol from blood vessels back to the liver for excretion.',
          clinicalSignificance: 'Higher is protective (above 50 mg/dL for women, above 40 mg/dL for men). Aerobic exercise and healthy fats help support healthy HDL.',
          questionsForDoctor: 'Are my HDL levels sufficient to offer cardioprotective benefits?',
        },
        {
          name: 'Triglycerides',
          code: 'TRIG',
          unit: 'mg/dL',
          minNormal: 50,
          maxNormal: 150,
          lowAlert: 30,
          highAlert: 200,
          category: 'Cardiovascular',
          meaning: 'Primary storage form of fat in serum; directly influenced by recent caloric intake and simple sugars.',
          clinicalSignificance: 'Normal is under 150 mg/dL. Elevations are closely tied to insulin resistance, refined sugar intake, and alcohol.',
          questionsForDoctor: 'What dietary adjustments would best optimize my triglyceride-to-HDL ratio?',
        },
      ],
    },
    {
      id: 'cbc',
      title: 'Complete Blood Count (CBC)',
      description: 'Evaluation of cellular blood components including erythrocytes, leukocytes, and platelets.',
      standardSources: 'Mayo Clinic Laboratories & American Society of Hematology',
      biomarkers: [
        {
          name: 'White Blood Cell Count',
          code: 'WBC',
          unit: 'x10³/µL',
          minNormal: 4.5,
          maxNormal: 11.0,
          lowAlert: 3.0,
          highAlert: 15.0,
          category: 'Hematology',
          meaning: 'Total immune defense cells circulating to combat bacterial, viral, or inflammatory challenges.',
          clinicalSignificance: 'Normal 4.5-11.0. Elevations often signify acute infection or physical stress. Lower counts may indicate viral suppression or marrow effects.',
          questionsForDoctor: 'Are my white blood cell differentials balanced across neutrophils and lymphocytes?',
        },
        {
          name: 'Hemoglobin',
          code: 'HGB',
          unit: 'g/dL',
          minNormal: 13.5,
          maxNormal: 17.5,
          lowAlert: 10.5,
          highAlert: 19.0,
          category: 'Hematology',
          meaning: 'Iron-containing oxygen-transport protein inside red blood cells.',
          clinicalSignificance: 'Healthy range 13.5-17.5 g/dL (men) or 12.0-15.5 g/dL (women). Low levels indicate anemia and impaired oxygen delivery.',
          questionsForDoctor: 'Does my hemoglobin reflect optimal iron storage and oxygenation capacity?',
        },
        {
          name: 'Platelet Count',
          code: 'PLT',
          unit: 'x10³/µL',
          minNormal: 150,
          maxNormal: 450,
          lowAlert: 100,
          highAlert: 550,
          category: 'Hematology',
          meaning: 'Cellular fragments essential for physiological hemostasis and blood clot formation.',
          clinicalSignificance: '150-450 is standard. Substantial decreases risk easy bruising/bleeding, while very high counts increase clotting risk.',
          questionsForDoctor: 'Are my platelet counts within safe limits for any planned physical activities or medications?',
        },
      ],
    },
    {
      id: 'glycemic',
      title: 'Glycemic & Metabolic Profile',
      description: 'Assessment of glucose regulation, pancreatic endocrine function, and long-term glycemic control.',
      standardSources: 'American Diabetes Association (ADA) Clinical Guidelines',
      biomarkers: [
        {
          name: 'Fasting Plasma Glucose',
          code: 'FPG',
          unit: 'mg/dL',
          minNormal: 70,
          maxNormal: 99,
          lowAlert: 65,
          highAlert: 126,
          category: 'Endocrine',
          meaning: 'Blood sugar concentration following an 8 to 12-hour overnight fast.',
          clinicalSignificance: 'Normal: 70-99 mg/dL. Impaired fasting glucose (prediabetes): 100-125 mg/dL. Diabetes: ≥126 mg/dL on repeat testing.',
          questionsForDoctor: 'Does this fasting level represent stable insulin sensitivity?',
        },
        {
          name: 'Hemoglobin A1c',
          code: 'HbA1c',
          unit: '%',
          minNormal: 4.0,
          maxNormal: 5.6,
          lowAlert: 3.8,
          highAlert: 6.5,
          category: 'Endocrine',
          meaning: 'Percentage of hemoglobin bound to glucose, reflecting mean blood sugar levels over the past 90 days.',
          clinicalSignificance: 'Normal: <5.7%. Prediabetes: 5.7%-6.4%. Diabetes diagnostic threshold: ≥6.5%.',
          questionsForDoctor: 'How often should we monitor my HbA1c to assess long-term metabolic health?',
        },
      ],
    },
  ];

  const [activePanelId, setActivePanelId] = useState<string>('lipid');
  const [selectedBiomarker, setSelectedBiomarker] = useState<LabBiomarker | null>(panels[0].biomarkers[0]);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  const activePanel = panels.find((p) => p.id === activePanelId) || panels[0];

  const getStatus = (bm: LabBiomarker) => {
    const rawVal = customValues[bm.code];
    if (!rawVal || isNaN(parseFloat(rawVal))) {
      return {
        hasValue: false,
        label: 'Clinical Reference Standard',
        color: 'text-slate-600 bg-slate-100 border-slate-200',
      };
    }

    const val = parseFloat(rawVal);
    if (val < bm.minNormal) {
      return { hasValue: true, val, label: 'Below Range', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    }
    if (val > bm.maxNormal) {
      return { hasValue: true, val, label: 'Elevated Above Target', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    }
    return { hasValue: true, val, label: 'Optimal / Within Range', color: 'text-[#00A88F] bg-[#F0FDF9] border-[#00A88F]/30' };
  };

  const handleValueChange = (code: string, text: string) => {
    setCustomValues((prev) => ({ ...prev, [code]: text }));
  };

  return (
    <div className="space-y-6 text-left">
      {/* Tool Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00A88F]">
          <Activity className="w-4 h-4" />
          <span>Interactive Clinical Tool</span>
          <span aria-hidden="true">·</span>
          <span>Fitmadix Diagnostic Intelligence</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Smart Medical Lab & Biomarker Decrypter
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Inspect clinical reference standards or input your actual test numbers to decode where they stand on standard physiological scales.
        </p>
      </div>

      {/* Panel Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {panels.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setActivePanelId(p.id);
              setSelectedBiomarker(p.biomarkers[0]);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activePanelId === p.id
                ? 'bg-[#002B49] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Biomarker List with interactive gauges */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>{activePanel.title} ({activePanel.biomarkers.length} Markers)</span>
            <span className="font-mono text-[11px] text-[#00A88F]">AHA / CDC Verified Boundaries</span>
          </div>

          <div className="space-y-3">
            {activePanel.biomarkers.map((bm) => {
              const status = getStatus(bm);
              const isSelected = selectedBiomarker?.code === bm.code;
              const userVal = customValues[bm.code] || '';

              // Gauge percentage
              const totalSpan = bm.highAlert - bm.lowAlert;
              const numericVal = status.hasValue && typeof status.val === 'number' ? status.val : (bm.minNormal + bm.maxNormal) / 2;
              const percent = Math.min(Math.max(((numericVal - bm.lowAlert) / totalSpan) * 100, 5), 95);
              const normalStart = ((bm.minNormal - bm.lowAlert) / totalSpan) * 100;
              const normalEnd = ((bm.maxNormal - bm.lowAlert) / totalSpan) * 100;

              return (
                <div
                  key={bm.code}
                  onClick={() => setSelectedBiomarker(bm)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-[#00A88F] shadow-sm ring-1 ring-[#00A88F]/50'
                      : 'border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{bm.name}</span>
                        <span className="font-mono text-[11px] text-slate-400">({bm.code})</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{bm.meaning}</p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <div className="text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Input field to enter actual patient number */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="text-xs text-slate-600 flex items-center gap-2">
                      <Edit3 className="w-3.5 h-3.5 text-[#00A88F]" />
                      <span className="font-medium">Your Value:</span>
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g. 150"
                        value={userVal}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleValueChange(bm.code, e.target.value)}
                        className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00A88F]"
                      />
                      <span className="text-[11px] font-mono text-slate-400">{bm.unit}</span>
                    </div>

                    <div className="text-right text-[11px] font-mono text-slate-500">
                      Standard Target: <span className="text-[#002B49] font-bold">{bm.minNormal} - {bm.maxNormal} {bm.unit}</span>
                    </div>
                  </div>

                  {/* Visual Range Track */}
                  <div className="mt-2.5">
                    <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      {/* Normal green target zone */}
                      <div
                        className="absolute top-0 bottom-0 bg-[#00A88F]/20"
                        style={{ left: `${normalStart}%`, width: `${normalEnd - normalStart}%` }}
                      />
                      {/* Current marker indicator if user entered value */}
                      {status.hasValue && (
                        <div
                          className="absolute top-0 bottom-0 w-2.5 bg-[#002B49] rounded-full shadow-xs -ml-1 transition-all"
                          style={{ left: `${percent}%` }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-Depth Diagnostic Breakdown & Doctor Prep */}
        <div className="lg:col-span-5 space-y-4">
          {selectedBiomarker && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A88F]">
                    {selectedBiomarker.category} Marker
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {selectedBiomarker.name}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#F0FDF9] text-[#00A88F] flex items-center justify-center font-bold text-xs">
                  {selectedBiomarker.code}
                </div>
              </div>

              {/* Patient Explanation */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#00A88F]" />
                  What this measures:
                </span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedBiomarker.meaning}
                </p>
              </div>

              {/* Clinical Significance */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Clinical Reference Range:
                </span>
                <p className="text-slate-600 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  {selectedBiomarker.clinicalSignificance}
                </p>
              </div>

              {/* Questions for Your Doctor */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                  Ask Your Physician:
                </span>
                <p className="text-slate-700 italic bg-sky-50/60 p-3 rounded-xl border border-sky-100">
                  "{selectedBiomarker.questionsForDoctor}"
                </p>
              </div>

              <div className="pt-2 text-[11px] text-slate-400">
                <span>Standardized according to: </span>
                <span className="font-medium text-slate-600">{activePanel.standardSources}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
