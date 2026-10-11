import React, { useState } from 'react';
import { Heart, Wind, Brain, Utensils, Bone, Activity, ShieldAlert, Sparkles, Check, ChevronRight } from 'lucide-react';

interface AnatomicalSystem {
  id: string;
  name: string;
  primaryOrgans: string[];
  keyBiomarkers: string[];
  recommendedScreenings: string[];
  preventiveHabits: string[];
  warningSymptoms: string[];
  summary: string;
}

export const AnatomicalBodyExplorer: React.FC = () => {
  const systems: AnatomicalSystem[] = [
    {
      id: 'cardiovascular',
      name: 'Cardiovascular & Circulatory System',
      primaryOrgans: ['Heart (Myocardium)', 'Coronary Arteries', 'Aorta & Peripheral Vessels'],
      keyBiomarkers: ['Blood Pressure (<120/80 mmHg)', 'Lipid Panel (LDL <100 mg/dL)', 'High-Sensitivity CRP (<1.0 mg/L)'],
      recommendedScreenings: ['Lipid profile every 4-6 years from age 20', 'Annual Blood Pressure measurement', 'Coronary Calcium Scan (CAC) if indicated'],
      preventiveHabits: ['150 mins/week moderate aerobic exercise', 'Mediterranean or DASH dietary pattern', '7-9 hours restorative sleep'],
      warningSymptoms: ['Substernal chest pressure or squeezing', 'Pain radiating to jaw, neck, or left arm', 'Unexplained shortness of breath on exertion'],
      summary: 'Drives systemic blood circulation, transporting oxygenated hemoglobin, glucose, and nutrients to every living tissue while returning metabolic byproducts for renal and pulmonary excretion.',
    },
    {
      id: 'respiratory',
      name: 'Pulmonary & Respiratory System',
      primaryOrgans: ['Lungs (Alveoli)', 'Trachea & Bronchi', 'Diaphragm Muscle'],
      keyBiomarkers: ['SpO2 Oxygen Saturation (95-100%)', 'Respiratory Rate (12-20 bpm)', 'FEV1 / FVC Spirometry Ratio'],
      recommendedScreenings: ['Baseline Spirometry for chronic cough/wheezing', 'Low-dose CT chest screening for eligible smoking history'],
      preventiveHabits: ['Zero tobacco or vapor inhalation', 'Indoor HEPA air filtration', 'Diaphragmatic breathing and aerobic conditioning'],
      warningSymptoms: ['Persistent cough exceeding 3 weeks', 'Hemoptysis (coughing blood)', 'Audible wheezing or resting dyspnea'],
      summary: 'Performs vital alveolar gas exchange, extracting ambient oxygen from inspired air into red blood cells while discharging gaseous carbon dioxide.',
    },
    {
      id: 'nervous',
      name: 'Neurological & Brain System',
      primaryOrgans: ['Cerebral Cortex', 'Cerebellum & Brainstem', 'Spinal Cord & Peripheral Nerves'],
      keyBiomarkers: ['Cognitive Baseline (MoCA / MMSE)', 'Reflex Latency', 'Cerebrospinal Fluid Parameters'],
      recommendedScreenings: ['Annual neurological exam with primary physician', 'Stroke risk assessment in atrial fibrillation / hypertension'],
      preventiveHabits: ['Continuous lifelong cognitive learning', 'Cardiovascular fitness supporting cerebral perfusion', 'Adequate dietary omega-3 DHA and B12'],
      warningSymptoms: ['FAST signs: Sudden facial droop, arm weakness, speech difficulty', 'Sudden severe "thunderclap" headache', 'Progressive numbness or ataxia'],
      summary: 'Coordinates sensation, conscious cognition, motor commands, autonomic homeostatic reflexes, and endocrine balance via 86 billion interconnected neural networks.',
    },
    {
      id: 'digestive',
      name: 'Gastrointestinal & Hepatic System',
      primaryOrgans: ['Stomach & Small Intestine', 'Liver (Hepatocytes)', 'Colon & Pancreas'],
      keyBiomarkers: ['ALT / AST Liver Enzymes', 'Fecal Occult Blood / FIT test', 'Serum Bilirubin & Albumin'],
      recommendedScreenings: ['Colorectal cancer screening from age 45 (Colonoscopy / FIT)', 'Hepatic ultrasound if metabolic risk present'],
      preventiveHabits: ['25-35 grams daily dietary prebiotic fiber', 'Diverse fermented foods supporting microbiome', 'Moderate or zero alcohol intake'],
      warningSymptoms: ['Unexplained rapid weight loss', 'Melena (dark tarry stool) or rectal bleeding', 'Persistent dysphagia (difficulty swallowing)'],
      summary: 'Breaks down complex carbohydrates, proteins, and lipids into cellular substrates, synthesizes essential clotting proteins in the liver, and harbors the human gut microbiome.',
    },
    {
      id: 'musculoskeletal',
      name: 'Musculoskeletal & Bone System',
      primaryOrgans: ['Skeleton (206 Bones)', 'Skeletal Muscles', 'Articular Cartilage & Ligaments'],
      keyBiomarkers: ['Serum 25-Hydroxy Vitamin D (>30 ng/mL)', 'Bone Mineral Density (T-score DEXA)', 'Serum Calcium & Alkaline Phosphatase'],
      recommendedScreenings: ['DEXA Bone Density Scan at age 65 (women) / 70 (men) or earlier with risk factors', 'Grip strength and mobility assessment'],
      preventiveHabits: ['Progressive resistance / strength training 2-3x/week', 'Adequate dietary protein (1.2-1.6g/kg if active)', 'Weight-bearing impacts supporting osteoblasts'],
      warningSymptoms: ['Low-trauma fragility fracture', 'Persistent joint swelling and morning stiffness >30 min', 'Rapid muscle wasting (sarcopenia)'],
      summary: 'Provides structural biomechanical protection for internal viscera, facilitates locomotive motion, acts as mineral reservoir for calcium/phosphate, and houses marrow for blood cell synthesis.',
    },
  ];

  const [activeSystemId, setActiveSystemId] = useState<string>('cardiovascular');
  const activeSystem = systems.find((s) => s.id === activeSystemId) || systems[0];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00A88F]">
          <Activity className="w-4 h-4" />
          <span>Interactive Anatomy & Physiology</span>
          <span aria-hidden="true">·</span>
          <span>OpenStax & NIH Verified</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Human Body & Organ System Explorer
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Explore physiological systems, organ interactions, essential clinical screenings, and early symptoms requiring medical attention.
        </p>
      </div>

      {/* Systems Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {systems.map((s) => {
          const isSelected = activeSystemId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSystemId(s.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#00A88F] bg-[#F0FDF9] ring-1 ring-[#00A88F]/50 shadow-xs'
                  : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center bg-slate-100 text-slate-800">
                {s.id === 'cardiovascular' && <Heart className={`w-4 h-4 ${isSelected ? 'text-[#00A88F]' : 'text-slate-600'}`} />}
                {s.id === 'respiratory' && <Wind className={`w-4 h-4 ${isSelected ? 'text-[#00A88F]' : 'text-slate-600'}`} />}
                {s.id === 'nervous' && <Brain className={`w-4 h-4 ${isSelected ? 'text-[#00A88F]' : 'text-slate-600'}`} />}
                {s.id === 'digestive' && <Utensils className={`w-4 h-4 ${isSelected ? 'text-[#00A88F]' : 'text-slate-600'}`} />}
                {s.id === 'musculoskeletal' && <Bone className={`w-4 h-4 ${isSelected ? 'text-[#00A88F]' : 'text-slate-600'}`} />}
              </div>
              <span className={`text-xs font-bold ${isSelected ? 'text-[#002B49]' : 'text-slate-800'}`}>
                {s.name.split('&')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active System Detailed Dossier */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#00A88F] font-bold uppercase tracking-wider">
            <span>Biological System Deep Dive</span>
            <span aria-hidden="true">·</span>
            <span>Fitmadix V2</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">{activeSystem.name}</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {activeSystem.summary}
          </p>
        </div>

        {/* 4-Corner Grid: Organs, Biomarkers, Screenings, Red Flags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Primary Organs */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#00A88F]" />
              Primary Organs & Tissue Structures:
            </span>
            <ul className="space-y-1.5 text-slate-600">
              {activeSystem.primaryOrgans.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-[#00A88F]">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Clinical Biomarkers */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#002B49]" />
              Key Clinical Parameters & Biomarkers:
            </span>
            <ul className="space-y-1.5 text-slate-600">
              {activeSystem.keyBiomarkers.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-[#002B49] font-mono font-bold">✓</span>
                  <span className="font-mono">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Screenings */}
          <div className="p-4 bg-[#F0FDF9] rounded-xl border border-[#00A88F]/20 space-y-2">
            <span className="font-bold text-[#002B49] flex items-center gap-1.5 text-xs">
              <Check className="w-3.5 h-3.5 text-[#00A88F]" />
              Recommended Evidence-Based Screenings:
            </span>
            <ul className="space-y-1.5 text-slate-700">
              {activeSystem.recommendedScreenings.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#00A88F] font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Warning Symptoms (Red Flags) */}
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2">
            <span className="font-bold text-rose-900 flex items-center gap-1.5 text-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Symptoms Requiring Clinical Attention:
            </span>
            <ul className="space-y-1.5 text-rose-800">
              {activeSystem.warningSymptoms.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
