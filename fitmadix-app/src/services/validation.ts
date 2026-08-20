

// Simple validation utilities that query public APIs for food, medicine, and disease data.
// These are minimal stubs – you can expand them with proper authentication and error handling.

export async function validateFoodItem(item: any): Promise<boolean> {
  const query = encodeURIComponent(item.name);
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query=${query}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.totalHits > 0;
  } catch (e) {
    console.error('Food validation error:', e);
    return false;
  }
}

export async function validateMedicineItem(item: any): Promise<boolean> {
  const query = encodeURIComponent(item.name);
  const url = `https://open.fda.gov/apis/drug/label.json?search=${query}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.results && data.results.length > 0;
  } catch (e) {
    console.error('Medicine validation error:', e);
    return false;
  }
}

export async function validateDiseaseItem(item: any): Promise<boolean> {
  const query = encodeURIComponent(item.name);
  const url = `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${query}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data[0] && data[0].length > 0;
  } catch (e) {
    console.error('Disease validation error:', e);
    return false;
  }
}
