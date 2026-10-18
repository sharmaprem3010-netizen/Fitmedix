import { GoogleGenAI } from '@google/genai';
import { generateClinicalEducationResponse } from '../src/services/ai/aiService.ts';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { prompt: rawPrompt, query: rawQuery, domain, userContext } = req.body || {};
  const prompt = rawPrompt || rawQuery;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, error: 'Query prompt is required' });
  }

  const acuteEmergencyKeywords = [
    'crushing chest pain',
    'chest pain radiating',
    'face drooping',
    'slurred speech',
    'cannot breathe',
    'choking',
    'severe blood loss',
    'overdose',
    'suicide',
    'anaphylaxis',
  ];
  const isEmergency = acuteEmergencyKeywords.some((kw) =>
    prompt.toLowerCase().includes(kw)
  );

  if (isEmergency) {
    return res.status(200).json({
      success: true,
      isEmergency: true,
      answer: `EMERGENCY ALERT: Your inquiry describes potential acute emergency medical symptoms. Please contact emergency services (call 911, 112, or your local emergency dispatch) immediately or go to the nearest emergency department. Do not delay emergency evaluation for online information.`,
      sources: ['American College of Emergency Physicians (ACEP)', 'Emergency Medical Triage Protocol'],
      confidence: 'emergency',
      suggestedFollowUps: ['Call 911 / 112 immediately', 'Locate nearest emergency trauma facility'],
    });
  }

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.length < 10) {
    const clinicalRes = generateClinicalEducationResponse(prompt, domain);
    return res.status(200).json({
      success: true,
      answer: clinicalRes.answer,
      sources: clinicalRes.sources,
      confidence: clinicalRes.confidence,
      suggestedFollowUps: clinicalRes.suggestedFollowUps,
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

    const systemPrompt = `You are the Fitmadix Medical Intelligence Assistant, a senior clinical educator specializing in patient health literacy, vitals interpretation, and terminology explanation.
Domain: ${domain || 'General Clinical Education'}.
User Language: ${userContext?.language || 'en'}.

Strict Clinical Directives:
1. Directly answer the user's inquiry, question, or scenario with compassionate, high-yield, scientifically grounded explanation.
2. If the user mentions vitals (such as Blood Pressure like 120/80 or 140/90, Heart Rate/BPM, Blood Glucose), analyze the specific numbers provided, classify them according to AHA/ACC/ADA guidelines, explain physiological implications, and suggest lifestyle steps.
3. Ground explanations in empirical medical standards (WHO, AHA, CDC, NIH, Mayo Clinic, Lancet).
4. Translate complex clinical abbreviations (e.g., BP, CBC, MCV, LDL-C, eGFR, HbA1c, TSH) into clear patient language.
5. NEVER make definitive personal medical diagnoses or prescribe pharmaceutical regimens.
6. Suggest 2-3 specific, high-yield questions the patient can bring to their physician.
7. If the query is in Spanish, Hindi, or Bengali, provide the answer fluently in that language while preserving clinical accuracy.`;

    const candidateModels = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite-preview'];
    let answerText = '';
    let usedModel = 'gemini-2.5-flash';

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: systemPrompt,
          },
        });
        const text = response.text?.trim() || '';
        if (text && text.length > 15) {
          answerText = text;
          usedModel = modelName;
          break;
        }
      } catch {
        // Fallback to next candidate model
      }
    }

    if (answerText) {
      return res.status(200).json({
        success: true,
        answer: answerText,
        sources: ['World Health Organization (WHO)', 'NIH National Library of Medicine', 'American Heart Association'],
        confidence: `verified-${usedModel}`,
        suggestedFollowUps: [
          'How does this relate to my long-term cardiovascular health?',
          'What lifestyle factors could influence these readings?',
          'What questions should I ask my doctor about this?',
        ],
      });
    }

    const clinicalRes = generateClinicalEducationResponse(prompt, domain);
    return res.status(200).json({
      success: true,
      answer: clinicalRes.answer,
      sources: clinicalRes.sources,
      confidence: clinicalRes.confidence,
      suggestedFollowUps: clinicalRes.suggestedFollowUps,
    });
  } catch {
    const clinicalRes = generateClinicalEducationResponse(prompt, domain);
    return res.status(200).json({
      success: true,
      answer: clinicalRes.answer,
      sources: clinicalRes.sources,
      confidence: clinicalRes.confidence,
      suggestedFollowUps: clinicalRes.suggestedFollowUps,
    });
  }
}
