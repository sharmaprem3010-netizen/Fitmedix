import { GoogleGenAI } from '@google/genai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { supabase } from '@/lib/supabaseClient';
import dbConnect from '@/lib/db';
import MedicalReport from '@/models/MedicalReport';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const maxDuration = 60; // Allow 60 seconds for Gemini API response

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'anonymous';

    const { base64Data, mimeType } = await req.json();

    if (!base64Data || !mimeType) {
      return new Response(JSON.stringify({ error: 'Missing image data or mimeType' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

    const promptText = `
You are an expert medical AI assistant. Analyze this medical report/blood test.
Extract the key biomarkers and provide a simple-language summary for a patient.
Always return your response in EXACTLY the following JSON format without any markdown wrappers or code blocks:
{
  "biomarkers": [
    { "label": "Hemoglobin", "value": "14.2 g/dL", "status": "normal" },
    { "label": "Blood Sugar (F)", "value": "142 mg/dL", "status": "high" }
  ],
  "summary": "Your blood work shows elevated fasting blood sugar..."
}
Note: "status" MUST be one of: "normal", "high", or "low".
    `;

    // 1. Process with Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType,
              },
            },
            { text: promptText },
          ],
        },
      ],
    });

    const outputText = response.text.trim();
    const cleanedOutput = outputText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    const parsedData = JSON.parse(cleanedOutput);

    // 2. Upload to Supabase Storage
    const buffer = Buffer.from(cleanBase64, 'base64');
    const extension = mimeType.split('/')[1] || 'jpg';
    const fileName = `${userId}_${Date.now()}.${extension}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('health-reports')
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError);
      throw new Error('Failed to upload document to cloud storage.');
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('health-reports')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // 3. Save to MongoDB
    await dbConnect();
    const newReport = await MedicalReport.create({
      userId,
      fileName,
      fileUrl: publicUrl,
      biomarkers: parsedData.biomarkers || [],
      summary: parsedData.summary || ''
    });

    // Return the combined result
    return new Response(JSON.stringify({
      ...parsedData,
      fileUrl: publicUrl,
      reportId: newReport._id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Translation API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process report', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
