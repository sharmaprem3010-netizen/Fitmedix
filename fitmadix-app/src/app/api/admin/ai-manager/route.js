import { GoogleGenAI } from '@google/genai';
import dbConnect from '@/lib/db';
import Medicine from '@/models/Medicine';
import Diet from '@/models/Diet';
import Exercise from '@/models/Exercise';
import YogaPose from '@/models/YogaPose';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemPrompt = `
You are an AI Data Manager for a health app.
Analyze the following user request and generate a JSON object to insert into the MongoDB database.
The entity type can be "Medicine", "Diet", "Exercise", or "YogaPose".

Return ONLY a valid JSON object in this exact format:
{
  "type": "Medicine" | "Diet" | "Exercise" | "YogaPose",
  "data": { ... fields matching the schema ... }
}

Schemas:
Medicine: { name, generic, expiry, usage, dosage, whenToUse, sideEffects, dangerous, tags: [{text, type: 'safe'|'caution'|'danger'}] }
Diet: { name, desc, emoji, gradient, meals: { breakfast, lunch, snack, dinner }, calories }
Exercise: { name, category, duration, calories, description, emoji, gradient }
YogaPose: { name, subtitle, duration, difficulty: 'Beginner'|'Intermediate'|'Advanced', focus, description, emoji, gradient }

For gradients, use a CSS linear-gradient string.
Ensure all required fields are filled with realistic, accurate medical/health data based on the prompt.
Do not wrap the JSON in markdown code blocks. Just output raw JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2
      }
    });

    let rawText = response.text;
    // Clean up potential markdown formatting
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/```json\n?/, '').replace(/```\n?$/, '');
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/```\n?/, '').replace(/```\n?$/, '');
    }
    
    const parsed = JSON.parse(rawText.trim());

    await dbConnect();
    
    let savedDoc;
    if (parsed.type === 'Medicine') {
      savedDoc = await Medicine.create(parsed.data);
    } else if (parsed.type === 'Diet') {
      savedDoc = await Diet.create(parsed.data);
    } else if (parsed.type === 'Exercise') {
      savedDoc = await Exercise.create(parsed.data);
    } else if (parsed.type === 'YogaPose') {
      savedDoc = await YogaPose.create(parsed.data);
    } else {
      return new Response(JSON.stringify({ error: 'Unknown entity type generated.' }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, type: parsed.type, data: savedDoc }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Manager Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
