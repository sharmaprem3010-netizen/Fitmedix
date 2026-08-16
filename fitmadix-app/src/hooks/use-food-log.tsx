import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodLogEntry {
  id: string;
  date: string;
  meal: MealType;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface DailySummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water_glasses: number;
}

export function useFoodLog(date: string) {
  const [entries, setEntries] = useState<FoodLogEntry[]>([]);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLog = useCallback(async () => {
    setLoading(true);
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      setLoading(false);
      return;
    }

    const { data, error } = await (supabase as any)
      .from('food_log')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('date', date)
      .order('created_at', { ascending: true });

    if (!error && data) {
      // In a real app, water might be stored separately or as a specific row type
      // For this implementation, we'll store water in local state for the day
      const storedWater = localStorage.getItem(`water_${date}`);
      if (storedWater) setWaterGlasses(parseInt(storedWater, 10));
      
      setEntries(data as unknown as FoodLogEntry[]);
    }
    setLoading(false);
  }, [date]);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  const addEntry = async (entry: Omit<FoodLogEntry, 'id'>) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const { data, error } = await (supabase as any)
      .from('food_log')
      .insert({
        user_id: user.user.id,
        ...entry
      })
      .select()
      .single();

    if (!error && data) {
      setEntries(prev => [...prev, data as unknown as FoodLogEntry]);
    } else {
        throw new Error(error?.message || "Failed to add entry");
    }
  };

  const removeEntry = async (id: string) => {
    const { error } = await (supabase as any).from('food_log').delete().eq('id', id);
    if (!error) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const updateWater = (glasses: number) => {
    setWaterGlasses(glasses);
    localStorage.setItem(`water_${date}`, glasses.toString());
  };

  const summary: DailySummary = entries.reduce((acc, entry) => ({
    calories: acc.calories + (entry.calories || 0),
    protein: acc.protein + (entry.protein_g || 0),
    carbs: acc.carbs + (entry.carbs_g || 0),
    fat: acc.fat + (entry.fat_g || 0),
    water_glasses: waterGlasses
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, water_glasses: waterGlasses });

  return {
    entries,
    summary,
    loading,
    addEntry,
    removeEntry,
    waterGlasses,
    updateWater,
    refresh: fetchLog
  };
}
