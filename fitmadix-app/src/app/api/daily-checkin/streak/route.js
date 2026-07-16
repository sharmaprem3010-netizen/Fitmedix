import dbConnect from '@/lib/db';
import DailyCheckin from '@/models/DailyCheckin';

export async function GET(request) {
  try {
    await dbConnect();
    // In a real app we'd filter by userId.
    const checkins = await DailyCheckin.find({}).sort({ date: -1 }).lean();
    
    // Calculate streak
    let streak = 0;
    let currentStreak = true;
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const loggedDates = new Set(checkins.map(c => c.date));
    
    let checkDate = new Date(today);
    
    // Check if they checked in today or yesterday to maintain a streak
    const todayStr = checkDate.toISOString().split('T')[0];
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = checkDate.toISOString().split('T')[0];
    
    if (loggedDates.has(todayStr)) {
      streak = 1;
      checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (loggedDates.has(yesterdayStr)) {
      streak = 1; // It hasn't broken yet, today is still pending
      checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - 2);
    } else {
      currentStreak = false;
    }
    
    if (currentStreak) {
      while (true) {
        const dStr = checkDate.toISOString().split('T')[0];
        if (loggedDates.has(dStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return new Response(JSON.stringify({ 
      streak,
      history: checkins.map(c => ({
        date: c.date,
        energy: c.energyLevel,
        symptoms: c.symptoms?.length || 0
      }))
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
