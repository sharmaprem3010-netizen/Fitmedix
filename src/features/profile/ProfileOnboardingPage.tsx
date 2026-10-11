import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Heart,
  Target,
  Eye,
  ArrowRight,
  ArrowLeft,
  Check,
  Shield,
  Volume2,
} from 'lucide-react';
import { useAuth } from '../authentication/AuthContext.tsx';
import { useLanguage } from '../onboarding/LanguageContext.tsx';
import { useVoice } from '../voice/VoiceContext.tsx';
import { useAccessibility } from '../../components/accessibility/AccessibilityContext.tsx';
import { BiologicalSex, BloodGroup, TextSizePreference, SupportedLanguage } from '../../types/index.ts';
import { SUPPORTED_LANGUAGES } from '../../lib/i18n/languages.ts';
import { Input } from '../../components/ui/Input.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { FitmadixLogo } from '../../components/ui/Logo.tsx';

export const ProfileOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, saveProfile } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { isVoiceMode, setVoiceMode, speak } = useVoice();
  const { textSize, setTextSize, highContrast, setHighContrast, reducedMotion, setReducedMotion } =
    useAccessibility();

  const [step, setStep] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);

  // Step 1: Basic
  const [fullName, setFullName] = useState(user?.fullName || profile?.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState(profile?.dateOfBirth || '');
  const [age, setAge] = useState<string>(profile?.age ? String(profile.age) : '');
  const [sex, setSex] = useState<BiologicalSex>(profile?.sex || 'prefer-not-to-say');
  const [heightCm, setHeightCm] = useState<string>(profile?.heightCm ? String(profile.heightCm) : '');
  const [weightKg, setWeightKg] = useState<string>(profile?.weightKg ? String(profile.weightKg) : '');

  // Step 2: Health
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(profile?.bloodGroup || 'unknown');
  const [conditionsText, setConditionsText] = useState(profile?.knownConditions?.join(', ') || '');
  const [allergiesText, setAllergiesText] = useState(profile?.allergies?.join(', ') || '');
  const [medicationsText, setMedicationsText] = useState(profile?.currentMedications?.join(', ') || '');
  const [surgeriesText, setSurgeriesText] = useState(profile?.previousSurgeries?.join(', ') || '');

  // Step 3: Goals
  const availableGoals = [
    { id: 'general-wellness', label: 'General wellness & daily vitality' },
    { id: 'fitness', label: 'Cardiovascular & physical fitness' },
    { id: 'weight-management', label: 'Healthy weight management' },
    { id: 'exercise', label: 'Structured exercise routines' },
    { id: 'nutrition', label: 'Nutrition & dietary guidance' },
    { id: 'understanding-records', label: 'Understanding medical test reports' },
    { id: 'managing-condition', label: 'Managing an existing health condition' },
  ];
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    profile?.healthGoals || ['general-wellness']
  );

  // Step 4: Accessibility
  const [prefLang, setPrefLang] = useState<SupportedLanguage>(language);
  const [prefVoice, setPrefVoice] = useState<boolean>(isVoiceMode);
  const [prefTextSize, setPrefTextSize] = useState<TextSizePreference>(textSize);
  const [prefContrast, setPrefContrast] = useState<boolean>(highContrast);
  const [prefMotion, setPrefMotion] = useState<boolean>(reducedMotion);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  const parseCommaList = (str: string): string[] => {
    return str
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const handleNext = () => {
    if (step === 1 && isVoiceMode) {
      speak('Step 2: Medical information. This data remains private and confidential.');
    } else if (step === 2 && isVoiceMode) {
      speak('Step 3: Wellness goals. Select what matters most to you.');
    } else if (step === 3 && isVoiceMode) {
      speak('Step 4: Accessibility preferences. Personalize your visual and voice experience.');
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleComplete = async () => {
    setSaving(true);
    // Apply accessibility preferences immediately
    setLanguage(prefLang);
    setVoiceMode(prefVoice);
    setTextSize(prefTextSize);
    setHighContrast(prefContrast);
    setReducedMotion(prefMotion);

    await saveProfile({
      fullName,
      dateOfBirth,
      age: age ? parseInt(age, 10) : undefined,
      sex,
      heightCm: heightCm ? parseFloat(heightCm) : undefined,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      bloodGroup,
      knownConditions: parseCommaList(conditionsText),
      allergies: parseCommaList(allergiesText),
      currentMedications: parseCommaList(medicationsText),
      previousSurgeries: parseCommaList(surgeriesText),
      healthGoals: selectedGoals,
      accessibility: {
        language: prefLang,
        voiceModeEnabled: prefVoice,
        textSize: prefTextSize,
        highContrast: prefContrast,
        reducedMotion: prefMotion,
        screenReaderOptimized: false,
      },
    });

    if (prefVoice) {
      speak('Profile complete! Welcome to your FitMadix health home.');
    }

    setSaving(false);
    navigate('/home');
  };

  const stepsMeta = [
    { num: 1, label: 'Basic Info', icon: User },
    { num: 2, label: 'Medical Info', icon: Heart },
    { num: 3, label: 'Health Goals', icon: Target },
    { num: 4, label: 'Accessibility', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      {/* Step Tracker Header */}
      <div className="w-full max-w-2xl mb-8 flex flex-col items-center">
        <div className="mb-4">
          <FitmadixLogo size="md" showTagline={false} />
        </div>
        <div className="text-center mb-6">
          <p className="text-xs uppercase font-bold tracking-wider text-[#00A88F] mb-1">
            Step {step} of 4
          </p>
          <h1 className="text-2xl font-black tracking-tight text-[#002B49]">
            {step === 1 && 'Basic Information'}
            {step === 2 && 'Health & Medical Background'}
            {step === 3 && 'Your Wellness Goals'}
            {step === 4 && 'Accessibility & Display Preferences'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personalize Fitmadix for your physiological context. All records remain private.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full grid grid-cols-4 gap-2 sm:gap-4">
          {stepsMeta.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-colors ${
                  isCurrent
                    ? 'border-[#00A88F] bg-[#F0FDF9] text-[#002B49] font-bold shadow-2xs'
                    : isCompleted
                    ? 'border-emerald-300 bg-emerald-50/50 text-emerald-800'
                    : 'border-slate-200 bg-slate-100/60 text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#00A88F] text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3 h-3" />}
                </div>
                <span className="hidden sm:inline truncate">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Multi-Step Form Card */}
      <div className="w-full max-w-2xl bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 sm:p-8 space-y-6">
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Elena Vance"
              requiredIndicator
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date of Birth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
              <Input
                label="Age (Years)"
                type="number"
                min="1"
                max="125"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 34"
              />
            </div>

            <Select
              label="Biological Sex (for metabolic & reference metrics)"
              value={sex}
              onChange={(e) => setSex(e.target.value as BiologicalSex)}
              options={[
                { value: 'female', label: 'Female' },
                { value: 'male', label: 'Male' },
                { value: 'other', label: 'Other / Intersex' },
                { value: 'prefer-not-to-say', label: 'Prefer not to say' },
              ]}
              helperText="Biological reference ranges vary by sex for certain lab diagnostics."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Height (cm)"
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="e.g. 170"
              />
              <Input
                label="Weight (kg)"
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 68"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Health Information */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl flex items-start gap-2.5 text-xs text-sky-900">
              <Shield className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Privacy First: </span>
                Medical data is strictly encrypted and used solely to tailor educational health guidance.
                None of this information is sold or publicly shared.
              </div>
            </div>

            <Select
              label="Blood Group"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              options={[
                { value: 'unknown', label: 'Not known / Not tested' },
                { value: 'A+', label: 'A Positive (A+)' },
                { value: 'A-', label: 'A Negative (A-)' },
                { value: 'B+', label: 'B Positive (B+)' },
                { value: 'B-', label: 'B Negative (B-)' },
                { value: 'AB+', label: 'AB Positive (AB+)' },
                { value: 'AB-', label: 'AB Negative (AB-)' },
                { value: 'O+', label: 'O Positive (O+)' },
                { value: 'O-', label: 'O Negative (O-)' },
              ]}
            />

            <Input
              label="Known Medical Conditions"
              placeholder="e.g. Hypertension, Asthma, Type 2 Diabetes (separated by commas)"
              value={conditionsText}
              onChange={(e) => setConditionsText(e.target.value)}
              helperText="Leave empty if none or not applicable."
            />

            <Input
              label="Allergies (Medicinal or Food)"
              placeholder="e.g. Penicillin, Peanuts, Sulfa drugs"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              helperText="Crucial for contraindication warnings in medicine references."
            />

            <Input
              label="Current Medications"
              placeholder="e.g. Metformin 500mg, Levothyroxine 50mcg"
              value={medicationsText}
              onChange={(e) => setMedicationsText(e.target.value)}
            />

            <Input
              label="Previous Surgeries or Major Procedures"
              placeholder="e.g. Appendectomy (2018), Knee Arthroscopy (2022)"
              value={surgeriesText}
              onChange={(e) => setSurgeriesText(e.target.value)}
            />
          </div>
        )}

        {/* STEP 3: Goals */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Select one or more wellness objectives so FitMadix can prioritize relevant modules:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {availableGoals.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/50 text-slate-900 font-medium'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-sm">{goal.label}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected
                          ? 'bg-sky-600 border-sky-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Accessibility */}
        {step === 4 && (
          <div className="space-y-5">
            {/* Preferred Language */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Preferred Interface Language
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setPrefLang(l.code)}
                    className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      prefLang === l.code
                        ? 'border-sky-600 bg-sky-50 font-semibold text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="text-sm">{l.nativeName}</div>
                    <div className="text-[11px] text-slate-500">{l.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>Voice Assistance Mode</span>
                </div>
                <p className="text-xs text-slate-500">
                  Speaks screen content aloud and enables voice commands for accessibility.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPrefVoice(!prefVoice)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  prefVoice ? 'bg-sky-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    prefVoice ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Text Size Preference */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Typography Scale
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['standard', 'large', 'xlarge'] as TextSizePreference[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setPrefTextSize(sz)}
                    className={`p-3 rounded-lg border text-center capitalize transition-colors cursor-pointer ${
                      prefTextSize === sz
                        ? 'border-sky-600 bg-sky-50 font-semibold text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className={sz === 'standard' ? 'text-xs' : sz === 'large' ? 'text-sm' : 'text-base font-semibold'}>
                      {sz}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast Mode */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-slate-900">High Contrast Mode</span>
                <p className="text-xs text-slate-500">
                  Increases border definition and ensures maximum WCAG contrast for low-vision users.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPrefContrast(!prefContrast)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  prefContrast ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    prefContrast ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-slate-900">Reduced Motion</span>
                <p className="text-xs text-slate-500">
                  Suppresses animations and transitions for users with vestibular sensitivity.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPrefMotion(!prefMotion)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  prefMotion ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    prefMotion ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Form Nav Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button onClick={handleNext}>
              Next Step <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button onClick={handleComplete} isLoading={saving}>
              Complete Profile & Go to Home <Check className="w-4 h-4 ml-1.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
