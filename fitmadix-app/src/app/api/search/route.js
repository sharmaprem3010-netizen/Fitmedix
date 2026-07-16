import dbConnect from '@/lib/db';
import Medicine from '@/models/Medicine';
import YogaPose from '@/models/YogaPose';
import Exercise from '@/models/Exercise';
import Diet from '@/models/Diet';
import Disease from '@/models/Disease';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  if (!q) {
    return new Response(JSON.stringify({ results: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  await dbConnect();
  const regex = new RegExp(q, 'i');
  const [medicines, yoga, exercises, diets, diseases] = await Promise.all([
    Medicine.find({ visible: true, $or: [{ name: regex }, { generic: regex }, { usage: regex }] }).lean(),
    YogaPose.find({ visible: true, $or: [{ name: regex }, { subtitle: regex }] }).lean(),
    Exercise.find({ visible: true, $or: [{ name: regex }, { category: regex }, { description: regex }] }).lean(),
    Diet.find({ visible: true, $or: [{ name: regex }, { desc: regex }] }).lean(),
    Disease.find({ visible: true, $or: [{ name: regex }, { category: regex }, { symptoms: regex }] }).lean(),
  ]);
  return new Response(JSON.stringify({ medicines, yoga, exercises, diets, diseases }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
