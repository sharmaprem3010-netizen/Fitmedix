import dbConnect from '@/lib/db';
import Exercise from '@/models/Exercise';
import { SEED_EXERCISES } from '@/lib/seedData';

export async function GET() {
  try {
    await dbConnect();
    let exercises = await Exercise.find({ visible: true }).sort({ category: 1, name: 1 }).lean();
    if (exercises.length === 0) {
      await Exercise.insertMany(SEED_EXERCISES);
      exercises = await Exercise.find({ visible: true }).sort({ category: 1, name: 1 }).lean();
    }
    return Response.json({ exercises });
  } catch (error) {
    console.error('Exercises API Error:', error);
    return Response.json({ exercises: SEED_EXERCISES, source: 'fallback' });
  }
}
