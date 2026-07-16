import dbConnect from '@/lib/db';
import Medicine from '@/models/Medicine';
import { SEED_MEDICINES } from '@/lib/seedData';

export async function GET() {
  try {
    await dbConnect();

    let medicines = await Medicine.find({ visible: true }).sort({ name: 1 }).lean();

    // If database is empty, seed it with initial data
    if (medicines.length === 0) {
      await Medicine.insertMany(SEED_MEDICINES);
      medicines = await Medicine.find({ visible: true }).sort({ name: 1 }).lean();
    }

    return new Response(JSON.stringify({ medicines }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Medicines API Error:', error);
    
    // Fallback to seed data if DB is unavailable
    return new Response(JSON.stringify({ medicines: SEED_MEDICINES, source: 'fallback' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
