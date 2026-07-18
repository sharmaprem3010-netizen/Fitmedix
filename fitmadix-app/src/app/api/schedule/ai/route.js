import dbConnect from '@/lib/db';
import Schedule from '@/models/Schedule';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const { date } = data;

    if (!date) {
      return new Response(JSON.stringify({ error: 'Date is required' }), { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const prompt = `Generate a healthy, balanced daily schedule for a user for the date ${date}. 
Include exactly 4 or 5 items. The items should include things like waking up, a healthy meal, exercise or a medical checkup/reminder, and relaxation.
Respond ONLY with a valid JSON array of objects. Do not use Markdown formatting or backticks.
Each object must have exactly these keys:
"time" (string, e.g. "08:00 AM")
"title" (string, e.g. "Morning Yoga" or "Breakfast")
"type" (string, a short subtitle e.g. "Stretching" or "Oatmeal & Fruits")
"icon" (string, a single suitable emoji e.g. "🧘" or "🍎")

Example format:
[
  { "time": "08:00 AM", "title": "Morning Walk", "type": "Light Cardio", "icon": "🚶" }
]`;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    let generatedSchedule;
    try {
      const textResponse = aiResponse.text;
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      generatedSchedule = JSON.parse(textResponse);
    } catch (err) {
      console.error("AI parse error:", err);
      return new Response(JSON.stringify({ error: 'Failed to parse AI response' }), { status: 500 });
    }

    // Save generated schedule to DB
    const savedItems = [];
    for (const item of generatedSchedule) {
      const newSchedule = await Schedule.create({
        userId: userId || null,
        date,
        time: item.time,
        title: item.title,
        type: item.type,
        icon: item.icon
      });
      savedItems.push(newSchedule);
    }

    return new Response(JSON.stringify({ success: true, schedules: savedItems }), { status: 201 });
  } catch (error) {
    console.error("Schedule AI error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
