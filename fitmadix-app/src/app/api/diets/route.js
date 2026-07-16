import dbConnect from '@/lib/db';
import Diet from '@/models/Diet';
import { SEED_DIETS } from '@/lib/seedData';

export async function GET() {
  try {
    await dbConnect();
    let diets = await Diet.find({ visible: true }).sort({ name: 1 }).lean();
    if (diets.length === 0) {
      await Diet.insertMany(SEED_DIETS);
      diets = await Diet.find({ visible: true }).sort({ name: 1 }).lean();
    }
    return Response.json({ diets });
  } catch (error) {
    console.error('Diets API Error:', error);
    return Response.json({ diets: SEED_DIETS, source: 'fallback' });
  }
}
