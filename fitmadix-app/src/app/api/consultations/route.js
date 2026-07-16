import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Consultation from '@/models/Consultation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || 'default_user';

    await dbConnect();

    const consultations = await Consultation.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ consultations });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json({ error: 'Failed to fetch consultations' }, { status: 500 });
  }
}
