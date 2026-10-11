import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Pill,
  Brain,
  BookOpen,
  Activity,
  Dumbbell,
  Apple,
  LineChart,
  FolderHeart,
  Hospital,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Shield,
} from 'lucide-react';
import { ComingSoonState } from '../../components/ui/FeedbackStates.tsx';
import { LabReportDecoder } from '../tools/LabReportDecoder.tsx';
import { DrugInteractionChecker } from '../tools/DrugInteractionChecker.tsx';
import { AnatomicalBodyExplorer } from '../tools/AnatomicalBodyExplorer.tsx';
import { EmergencyMedicalCard } from '../tools/EmergencyMedicalCard.tsx';
import { HealthInsightsSection } from '../insights/HealthInsightsSection.tsx';

interface ExploreModule {
  id: string;
  category: 'Health' | 'Fitness' | 'Medical Records' | 'AI Tools' | 'Healthcare';
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  plannedSources: string[];
  capabilities: string[];
  interactiveComponent?: 'lab' | 'drug' | 'anatomy' | 'ice' | 'insights';
  directRoute?: string;
}

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModule, setActiveModule] = useState<ExploreModule | null>(null);
  const [activeToolView, setActiveToolView] = useState<'lab' | 'drug' | 'anatomy' | 'ice' | 'insights' | null>(null);

  const categories = ['All', 'Health', 'Fitness', 'Medical Records', 'AI Tools', 'Healthcare'];

  const modules: ExploreModule[] = [
    {
      id: 'medicines',
      category: 'Health',
      title: 'Medicines & Drug Interaction Checker',
      description: 'Comprehensive medication database and active drug-to-drug contraindication safety analyzer.',
      icon: Pill,
      plannedSources: ['FDA National Drug Code Directory', 'RxNorm Library of Medicine', 'DailyMed'],
      capabilities: ['Generic-to-brand mapping', 'Allergy cross-check against profile', 'Precautions for pregnant & elderly populations'],
      interactiveComponent: 'drug',
    },
    {
      id: 'health-insights',
      category: 'Health',
      title: 'Verified Health Insights Engine',
      description: 'Card-based medical intelligence synthesized via Gemini AI from peer-reviewed cardiology, endocrinology, and neurology sources.',
      icon: Sparkles,
      plannedSources: ['American Heart Association', 'WHO Guidelines', 'NIH / PubMed Literature'],
      capabilities: ['Card-based snippets', 'Signature medical grid styling', 'Auditory readout & clinical takeaways'],
      interactiveComponent: 'insights',
    },
    {
      id: 'lab-decrypter',
      category: 'Medical Records',
      title: 'Smart Lab & Biomarker Decrypter',
      description: 'Decode Complete Blood Count (CBC), Lipid, and Metabolic panels into plain language with clinical gauges.',
      icon: Activity,
      plannedSources: ['American Heart Association (AHA)', 'CDC National Health Metrics', 'Mayo Clinic'],
      capabilities: ['Visual reference range gauges', 'Clinical significance notes', 'Physician appointment question builder'],
      interactiveComponent: 'lab',
    },
    {
      id: 'human-body',
      category: 'Health',
      title: 'Human Body & Anatomy Systems',
      description: 'Interactive physiological explorer illustrating organ systems, vital parameters, and preventive screenings.',
      icon: Brain,
      plannedSources: ['OpenStax Anatomy & Physiology', 'National Institutes of Health (NIH)'],
      capabilities: ['Systemic physiological overviews', 'Interactive organ layer exploration', 'Evidence-based screening schedules'],
      interactiveComponent: 'anatomy',
    },
    {
      id: 'ice-card',
      category: 'Healthcare',
      title: 'Emergency Medical ID (ICE) Generator',
      description: 'Paramedic-ready printable emergency card containing blood type, allergies, medications, and contacts.',
      icon: Shield,
      plannedSources: ['International ICE Standard', 'Red Cross Emergency Protocols'],
      capabilities: ['Wallet-sized layout', 'Organ donor badge', 'Lock-screen ready'],
      interactiveComponent: 'ice',
    },
    {
      id: 'diseases',
      category: 'Health',
      title: 'Diseases & Pathologies',
      description: 'Verified clinical disease profiles, etiologies, progression stages, and prevention guidelines.',
      icon: FileText,
      plannedSources: ['World Health Organization (WHO)', 'ICD-11 Official Registry', 'PubMed / NCBI'],
      capabilities: ['Standardized diagnostic criteria overview', 'Symptom correlation', 'Evidence-based prevention guides'],
    },
    {
      id: 'encyclopedia',
      category: 'Health',
      title: 'Health Encyclopedia',
      description: 'Peer-reviewed health glossary clarifying clinical terminology into patient-friendly definitions.',
      icon: BookOpen,
      plannedSources: ['MedlinePlus Medical Encyclopedia', 'CDC Terminology Index'],
      capabilities: ['A-Z medical terminology indexing', 'Multilingual pronunciation guides', 'Accessible summaries'],
    },
    {
      id: 'exercise',
      category: 'Fitness',
      title: 'Exercise & Conditioning',
      description: 'Ergonomic exercise programming, rehabilitation movements, and heart-rate zone management.',
      icon: Dumbbell,
      plannedSources: ['American College of Sports Medicine (ACSM)', 'CDC Physical Activity Guidelines'],
      capabilities: ['Condition-adjusted routines', 'Form verification cues', 'Cardiorespiratory pacing'],
    },
    {
      id: 'nutrition',
      category: 'Fitness',
      title: 'Nutrition & Dietetics',
      description: 'Macronutrient balancing, clinical dietary adjustments, and allergen-safe meal recommendations.',
      icon: Apple,
      plannedSources: ['USDA FoodData Central', 'WHO Healthy Diet Factsheets'],
      capabilities: ['Nutrient density breakdowns', 'Allergen exclusion filters', 'Hydration planning'],
    },
    {
      id: 'progress',
      category: 'Fitness',
      title: 'Progress & Biometric Trends',
      description: 'Trend visualization for verified vitals, resting heart rate, sleep quality, and physical conditioning.',
      icon: LineChart,
      plannedSources: ['Verified User Data Inputs', 'Certified Bluetooth BLE Medical Monitors'],
      capabilities: ['Tabular metric tracking', 'Longitudinal trend curves', 'Physician export summary'],
    },
    {
      id: 'medical-reports',
      category: 'Medical Records',
      title: 'Medical Reports & Storage',
      description: 'Client-encrypted personal health record repository for laboratory analyses and doctor consultation notes.',
      icon: FolderHeart,
      plannedSources: ['Supabase Encrypted Storage Buckets', 'HL7 FHIR Document Standards'],
      capabilities: ['Document tag categorization', 'PDF & high-res image ingestion', 'Private shareable access links'],
      directRoute: '/records',
    },
    {
      id: 'hospitals',
      category: 'Healthcare',
      title: 'Nearby Hospitals & Clinics',
      description: 'Geospatial facility locator for registered emergency rooms, diagnostic centers, and clinics.',
      icon: Hospital,
      plannedSources: ['OpenStreetMap Healthcare Nodes', 'State Health Department Facility Registries'],
      capabilities: ['Empirical GPS proximity computation', 'Emergency trauma center indicator', 'Operational phone contacts'],
    },
    {
      id: 'ai-assistant',
      category: 'AI Tools',
      title: 'AI Health Assistant',
      description: 'Context-aware conversational guidance for breaking down lab abbreviations and educational health queries.',
      icon: Sparkles,
      plannedSources: ['Gemini Medical Grounding', 'Peer-reviewed Knowledge Graph'],
      capabilities: ['Plain-language clinical translation', 'Allergy-aware dietary reminders', 'Safety triage guardrails'],
      directRoute: '/ai',
    },
  ];

  const filteredModules =
    selectedCategory === 'All'
      ? modules
      : modules.filter((m) => m.category === selectedCategory);

  if (activeToolView) {
    return (
      <div className="py-4 space-y-4">
        <button
          onClick={() => setActiveToolView(null)}
          className="text-xs font-bold text-[#00A88F] hover:underline cursor-pointer flex items-center gap-1.5"
        >
          ← Back to All Modules
        </button>
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          {activeToolView === 'lab' && <LabReportDecoder />}
          {activeToolView === 'drug' && <DrugInteractionChecker />}
          {activeToolView === 'anatomy' && <AnatomicalBodyExplorer />}
          {activeToolView === 'ice' && <EmergencyMedicalCard />}
          {activeToolView === 'insights' && <HealthInsightsSection />}
        </div>
      </div>
    );
  }

  if (activeModule) {
    return (
      <div className="py-4">
        <ComingSoonState
          title={activeModule.title}
          category={activeModule.category}
          description={activeModule.description}
          plannedSources={activeModule.plannedSources}
          expectedCapabilities={activeModule.capabilities}
          onBack={() => setActiveModule(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#00A88F] uppercase tracking-wider">
          <span>Explore Directory</span>
          <span aria-hidden="true">·</span>
          <span>Fitmadix V2 Suite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#002B49]">
          Health & Wellness Modules
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Fitmadix is built to host 20+ verified health modules. Connect to interactive clinical tools or inspect the architectural roadmap for each upcoming empirical service.
        </p>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200" role="tablist">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-[#002B49] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModules.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.interactiveComponent) {
                  setActiveToolView(item.interactiveComponent);
                } else if (item.directRoute) {
                  navigate(item.directRoute);
                } else {
                  setActiveModule(item);
                }
              }}
              className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-[#00A88F]/50 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-[#F0FDF9] group-hover:text-[#00A88F] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.interactiveComponent && (
                      <span className="text-[10px] font-bold text-[#00A88F] bg-[#F0FDF9] px-2 py-0.5 rounded-full border border-[#00A88F]/20">
                        Interactive
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-slate-400">{item.category}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#002B49] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="group-hover:text-[#00A88F] transition-colors">
                  {item.interactiveComponent ? 'Launch Interactive Tool' : 'View Architecture Scope'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00A88F] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Medical Data Quality Notice */}
      <div className="p-4 bg-slate-100/80 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-600">
        <ShieldAlert className="w-4 h-4 text-[#00A88F] shrink-0 mt-0.5" />
        <p>
          Data Isolation Rule: Fitmadix never stores hardcoded medical claims in random frontend templates. Every clinical module links directly to validated registries via strict service interfaces.
        </p>
      </div>
    </div>
  );
};
