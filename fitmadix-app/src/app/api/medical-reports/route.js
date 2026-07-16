import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/db';
import MedicalReport from '@/models/MedicalReport';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'anonymous';

    await dbConnect();

    const reports = await MedicalReport.find({ userId }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(reports), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Fetch Reports Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch medical reports', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
