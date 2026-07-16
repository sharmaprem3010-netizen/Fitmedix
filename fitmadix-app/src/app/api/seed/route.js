import dbConnect from '@/lib/db';
import Medicine from '@/models/Medicine';
import Disease from '@/models/Disease';
import Diet from '@/models/Diet';
import Exercise from '@/models/Exercise';
import YogaPose from '@/models/YogaPose';
import QA from '@/models/QA';
import { SEED_MEDICINES, SEED_DISEASES, SEED_DIETS, SEED_EXERCISES, SEED_YOGA, SEED_QA } from '@/lib/seedData';

export async function POST() {
  try {
    await dbConnect();

    const results = {};

    // Seed each collection only if empty
    const collections = [
      { model: Medicine, seed: SEED_MEDICINES, name: 'medicines' },
      { model: Disease, seed: SEED_DISEASES, name: 'diseases' },
      { model: Diet, seed: SEED_DIETS, name: 'diets' },
      { model: Exercise, seed: SEED_EXERCISES, name: 'exercises' },
      { model: YogaPose, seed: SEED_YOGA, name: 'yoga' },
      { model: QA, seed: SEED_QA, name: 'qa' },
    ];

    for (const { model, seed, name } of collections) {
      const count = await model.countDocuments();
      if (count === 0) {
        await model.insertMany(seed);
        results[name] = `Seeded ${seed.length} items`;
      } else {
        results[name] = `Already has ${count} items`;
      }
    }

    return Response.json({ success: true, results });
  } catch (error) {
    console.error('Seed Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
