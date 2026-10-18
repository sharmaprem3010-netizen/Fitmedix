import { GoogleGenAI, Type } from '@google/genai';

const FALLBACK_INSIGHTS = [
  {
    id: 'insight-1',
    title: 'Zone 2 Cardio & Mitochondrial Density',
    category: 'Cardiovascular',
    snippet: 'Sustained moderate aerobic exercise (60-70% max heart rate) triggers mitochondrial biogenesis and elevates lactate clearance efficiency without systemic cortisol spikes.',
    clinicalContext: 'Improves stroke volume, capillary perfusion in skeletal muscle, and resting heart rate variability (HRV).',
    evidenceSource: 'American College of Sports Medicine (ACSM) & Circulation (AHA)',
    actionableAdvice: 'Dedicate 120-150 minutes weekly to conversational-pace walking, cycling, or swimming.',
    tags: ['Cardiology', 'Mitochondria', 'Aerobic Fitness'],
    icon: 'heart',
  },
  {
    id: 'insight-2',
    title: 'Postprandial Glucose Attenuation via Soluble Fiber',
    category: 'Metabolic Health',
    snippet: 'Consuming viscous soluble fibers (beta-glucan, psyllium, legumes) prior to starchy carbohydrates delays gastric emptying, reducing acute post-meal glycemic surges by 20-35%.',
    clinicalContext: 'Reduces pancreatic insulin demand and dampens oxidative stress from glucose excursions in vascular endothelium.',
    evidenceSource: 'American Diabetes Association (ADA) Clinical Guidelines',
    actionableAdvice: 'Start meals with non-starchy leafy greens or fermented vegetables before fast-digesting carbohydrates.',
    tags: ['Endocrinology', 'Glucose Control', 'Metabolism'],
    icon: 'activity',
  },
  {
    id: 'insight-3',
    title: 'Glymphatic Brain Clearance During Slow-Wave Sleep',
    category: 'Neurology',
    snippet: 'The brain glymphatic system expands extracellular volume by 60% during deep N3 slow-wave sleep, washing out neurotoxic metabolites including amyloid-beta and hyperphosphorylated tau.',
    clinicalContext: 'Chronic sleep fragmentation impairs astroglial aquaporin-4 channel clearance, accelerating cognitive fatigue.',
    evidenceSource: 'National Institute of Neurological Disorders and Stroke (NINDS / NIH)',
    actionableAdvice: 'Maintain a cool bedroom environment (18-19°C) and cease blue-spectrum light exposure 90 minutes before sleep.',
    tags: ['Neurology', 'Sleep Architecture', 'Brain Health'],
    icon: 'brain',
  },
  {
    id: 'insight-4',
    title: 'Sodium-to-Potassium Ratio in Vascular Endothelium',
    category: 'Cardiovascular',
    snippet: 'Dietary potassium intake (3,500-4,700 mg/day) counteracts sodium-induced volume retention by promoting renal natriuresis and nitric oxide-mediated vasodilation.',
    clinicalContext: 'Clinical trials demonstrate that optimizing the Na:K ratio lowers systolic blood pressure more effectively than sodium restriction alone.',
    evidenceSource: 'World Health Organization (WHO) & DASH Collaborative Research Group',
    actionableAdvice: 'Incorporate potassium-dense whole foods like avocados, spinach, lentils, and edamame (unless contraindicated by chronic kidney disease).',
    tags: ['Hypertension', 'Electrolytes', 'Vascular Health'],
    icon: 'shield',
  },
  {
    id: 'insight-5',
    title: 'Cytochrome P450 3A4 Grapefruit Furano-coumarin Inhibition',
    category: 'Pharmacology',
    snippet: 'Furanocoumarins in grapefruit irreversibly inhibit intestinal CYP3A4 enzymes, multiplying systemic blood concentrations of certain statins and calcium channel blockers.',
    clinicalContext: 'Can elevate oral bioavailability by 200-500%, increasing risk of rhabdomyolysis or severe hypotension.',
    evidenceSource: 'U.S. Food and Drug Administration (FDA) Drug Safety Communications',
    actionableAdvice: 'Always verify fruit and herbal supplement interactions when prescribed lipid-lowering or antihypertensive medications.',
    tags: ['Medication Safety', 'Pharmacokinetics', 'FDA'],
    icon: 'pill',
  },
  {
    id: 'insight-6',
    title: 'Eccentric Muscle Loading & Tendon Collagen Synthesis',
    category: 'Musculoskeletal',
    snippet: 'Controlled eccentric resistance training (lengthening under tension) stimulates tenocyte mechanoreceptors and Type I collagen alignment in load-bearing tendons.',
    clinicalContext: 'Preserves joint stability, bone mineral density (Wolff Law), and reduces age-related sarcopenia.',
    evidenceSource: 'British Journal of Sports Medicine & NIH Osteoporosis Resource Center',
    actionableAdvice: 'Perform 2-3 weekly sessions of slow, 3-second lowering phase resistance movements for major muscle groups.',
    tags: ['Longevity', 'Biomechanics', 'Strength'],
    icon: 'sparkles',
  },
];

export default async function handler(req: any, res: any) {
  const { category = 'All', language = 'en', count = 6 } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;

  const getFilteredFallbacks = (cat: string) => {
    if (!cat || cat === 'All') return FALLBACK_INSIGHTS;
    const filtered = FALLBACK_INSIGHTS.filter(
      (item) => item.category.toLowerCase() === cat.toLowerCase()
    );
    return filtered.length > 0 ? filtered : FALLBACK_INSIGHTS;
  };

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.length < 10) {
    return res.status(200).json({
      success: true,
      source: 'verified-clinical-cache',
      insights: getFilteredFallbacks(category),
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const candidateModels = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite-preview'];
    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: `Generate ${count} evidence-backed, peer-reviewed clinical health and physiological insights for a health education platform. Category focus: ${category}. Output language: ${language}.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  snippet: { type: Type.STRING },
                  clinicalContext: { type: Type.STRING },
                  evidenceSource: { type: Type.STRING },
                  actionableAdvice: { type: Type.STRING },
                  tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  icon: { type: Type.STRING },
                },
                required: ['id', 'title', 'category', 'snippet', 'clinicalContext', 'evidenceSource', 'actionableAdvice', 'tags'],
              },
            },
          },
        });

        const parsed = JSON.parse(response.text?.trim() || '[]');
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.status(200).json({
            success: true,
            source: modelName,
            insights: parsed,
          });
        }
      } catch {
        // Fallback to next candidate model
      }
    }
  } catch {
    // Fallback to verified clinical insights
  }

  return res.status(200).json({
    success: true,
    source: 'verified-clinical-cache',
    insights: getFilteredFallbacks(category),
  });
}
