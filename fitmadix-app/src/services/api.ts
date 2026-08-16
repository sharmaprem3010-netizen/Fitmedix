import { supabase } from '../../lib/supabaseClient';

// Generic type for a record
export type Record = Record<string, any>;

// ---------- Food ----------
export async function getFoods() {
  const { data, error } = await supabase.from('foods').select('*');
  if (error) throw error;
  return data;
}

export async function getFoodById(id: number) {
  const { data, error } = await supabase.from('foods').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createFood(payload: Record) {
  const { data, error } = await supabase.from('foods').insert([payload]);
  if (error) throw error;
  return data;
}

export async function updateFood(id: number, payload: Record) {
  const { data, error } = await supabase.from('foods').update(payload).eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteFood(id: number) {
  const { data, error } = await supabase.from('foods').delete().eq('id', id);
  if (error) throw error;
  return data;
}

// ---------- Medicine ----------
export async function getMedicines() {
  const { data, error } = await supabase.from('medicines').select('*');
  if (error) throw error;
  return data;
}

export async function getMedicineById(id: number) {
  const { data, error } = await supabase.from('medicines').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createMedicine(payload: Record) {
  const { data, error } = await supabase.from('medicines').insert([payload]);
  if (error) throw error;
  return data;
}

export async function updateMedicine(id: number, payload: Record) {
  const { data, error } = await supabase.from('medicines').update(payload).eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteMedicine(id: number) {
  const { data, error } = await supabase.from('medicines').delete().eq('id', id);
  if (error) throw error;
  return data;
}

// ---------- Disease ----------
export async function getDiseases() {
  const { data, error } = await supabase.from('diseases').select('*');
  if (error) throw error;
  return data;
}

export async function getDiseaseById(id: number) {
  const { data, error } = await supabase.from('diseases').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createDisease(payload: Record) {
  const { data, error } = await supabase.from('diseases').insert([payload]);
  if (error) throw error;
  return data;
}

export async function updateDisease(id: number, payload: Record) {
  const { data, error } = await supabase.from('diseases').update(payload).eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteDisease(id: number) {
  const { data, error } = await supabase.from('diseases').delete().eq('id', id);
  if (error) throw error;
  return data;
}
