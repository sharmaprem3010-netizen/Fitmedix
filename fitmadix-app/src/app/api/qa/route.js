import dbConnect from '@/lib/db';
import QA from '@/models/QA';
import { SEED_QA } from '@/lib/seedData';

export async function GET() {
  try {
    await dbConnect();
    let items = await QA.find({ visible: true }).sort({ category: 1 }).lean();
    if (items.length === 0) {
      await QA.insertMany(SEED_QA);
      items = await QA.find({ visible: true }).sort({ category: 1 }).lean();
    }
    return Response.json({ items });
  } catch (error) {
    console.error('QA API Error:', error);
    return Response.json({ items: SEED_QA, source: 'fallback' });
  }
}
