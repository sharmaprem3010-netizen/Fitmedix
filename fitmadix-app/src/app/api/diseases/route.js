import dbConnect from '@/lib/db';
import Disease from '@/models/Disease';
import { SEED_DISEASES } from '@/lib/seedData';

export async function GET() {
  try {
    await dbConnect();
    let diseases = await Disease.find({ visible: true }).sort({ name: 1 }).lean();
    if (diseases.length === 0) {
      await Disease.insertMany(SEED_DISEASES);
      diseases = await Disease.find({ visible: true }).sort({ name: 1 }).lean();
    }
    return Response.json({ diseases });
  } catch (error) {
    console.error('Diseases API Error:', error);
    return Response.json({ diseases: SEED_DISEASES, source: 'fallback' });
  }
}
