import dbConnect from '@/lib/db';
import YogaPose from '@/models/YogaPose';
import { SEED_YOGA } from '@/lib/seedData';

export async function GET() {
  try {
    await dbConnect();
    let poses = await YogaPose.find({ visible: true }).sort({ name: 1 }).lean();
    if (poses.length === 0) {
      await YogaPose.insertMany(SEED_YOGA);
      poses = await YogaPose.find({ visible: true }).sort({ name: 1 }).lean();
    }
    return Response.json({ poses });
  } catch (error) {
    console.error('Yoga API Error:', error);
    return Response.json({ poses: SEED_YOGA, source: 'fallback' });
  }
}
