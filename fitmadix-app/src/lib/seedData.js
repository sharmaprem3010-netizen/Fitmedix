// Seed data for all collections

export const SEED_MEDICINES = [
  {
    name: "Paracetamol 500mg", generic: "Acetaminophen", expiry: "Dec 2027",
    usage: "Pain relief, fever reduction, headache",
    dosage: "1–2 tablets every 4–6 hours (max 4g/day)",
    sideEffects: "Nausea, stomach upset. Overdose causes severe liver damage.",
    dangerous: "Do NOT exceed 4g daily. Avoid with alcohol. Contraindicated in liver disease.",
    whenToUse: "For mild to moderate pain, fever, headaches, body aches",
    tags: [{ text: "Generally Safe", type: "safe" }, { text: "Avoid with Alcohol", type: "caution" }]
  },
  {
    name: "Amoxicillin 250mg", generic: "Amoxicillin Trihydrate", expiry: "Mar 2027",
    usage: "Bacterial infections — ear, throat, urinary tract, skin",
    dosage: "250–500mg every 8 hours for 7–10 days",
    sideEffects: "Diarrhea, nausea, skin rash. Rare: allergic reactions.",
    dangerous: "Allergic to penicillin? Do NOT take. Can cause severe anaphylaxis.",
    whenToUse: "Only for bacterial infections as prescribed by a doctor",
    tags: [{ text: "Prescription Only", type: "caution" }, { text: "Allergy Risk", type: "danger" }]
  },
  {
    name: "Metformin 500mg", generic: "Metformin Hydrochloride", expiry: "Jun 2028",
    usage: "Type 2 diabetes management, blood sugar control",
    dosage: "500mg twice daily with meals, gradually increased",
    sideEffects: "Nausea, diarrhea, metallic taste, vitamin B12 deficiency",
    dangerous: "Risk of lactic acidosis. Avoid with kidney disease. Stop before contrast dye procedures.",
    whenToUse: "For managing Type 2 diabetes when diet and exercise are insufficient",
    tags: [{ text: "Prescription Only", type: "caution" }, { text: "Monitor Kidneys", type: "danger" }]
  },
  {
    name: "Omeprazole 20mg", generic: "Omeprazole", expiry: "Sep 2027",
    usage: "Acid reflux (GERD), stomach ulcers, heartburn",
    dosage: "20mg once daily before breakfast for 4–8 weeks",
    sideEffects: "Headache, nausea, diarrhea. Long-term: bone fracture risk",
    dangerous: "Long-term use may cause magnesium deficiency, kidney problems.",
    whenToUse: "For persistent acid reflux, stomach ulcers, or Zollinger-Ellison syndrome",
    tags: [{ text: "Short-term Use", type: "caution" }, { text: "OTC Available", type: "safe" }]
  },
  {
    name: "Cetirizine 10mg", generic: "Cetirizine Dihydrochloride", expiry: "Jan 2028",
    usage: "Allergies — hay fever, hives, runny nose, itching",
    dosage: "10mg once daily. Children 6-12: 5mg daily",
    sideEffects: "Drowsiness, dry mouth, fatigue",
    dangerous: "May cause excessive drowsiness. Avoid driving. Use caution with alcohol.",
    whenToUse: "For seasonal allergies, chronic hives, allergic rhinitis",
    tags: [{ text: "Generally Safe", type: "safe" }, { text: "May Cause Drowsiness", type: "caution" }]
  },
  {
    name: "Ibuprofen 400mg", generic: "Ibuprofen", expiry: "Nov 2027",
    usage: "Pain, inflammation, arthritis, menstrual cramps",
    dosage: "200–400mg every 4–6 hours (max 1200mg/day OTC)",
    sideEffects: "Stomach upset, nausea, dizziness, GI bleeding risk",
    dangerous: "Avoid if you have stomach ulcers, heart disease, or kidney problems.",
    whenToUse: "For inflammation-related pain, arthritis, menstrual pain, dental pain",
    tags: [{ text: "NSAID", type: "caution" }, { text: "Avoid Long-term", type: "danger" }]
  },
  {
    name: "Azithromycin 500mg", generic: "Azithromycin Dihydrate", expiry: "Aug 2027",
    usage: "Bacterial infections — respiratory, skin, ear, STDs",
    dosage: "500mg day 1, then 250mg days 2–5 (Z-pack)",
    sideEffects: "Diarrhea, nausea, abdominal pain, headache",
    dangerous: "Can cause abnormal heart rhythms (QT prolongation).",
    whenToUse: "For bacterial respiratory infections, sinusitis, pneumonia, chlamydia",
    tags: [{ text: "Prescription Only", type: "caution" }, { text: "Heart Risk", type: "danger" }]
  },
  {
    name: "Vitamin D3 60000 IU", generic: "Cholecalciferol", expiry: "Feb 2028",
    usage: "Vitamin D deficiency, bone health, immunity",
    dosage: "60000 IU once weekly for 8 weeks (loading), then monthly",
    sideEffects: "Nausea, constipation. Overdose: hypercalcemia",
    dangerous: "Excessive doses can cause calcium buildup — kidney stones, heart problems.",
    whenToUse: "When blood Vitamin D levels are below 20 ng/mL",
    tags: [{ text: "Supplement", type: "safe" }, { text: "Follow Dosage", type: "caution" }]
  }
];

export const SEED_DISEASES = [
  {
    name: "Diabetes Mellitus", category: "Metabolic Disorder", icon: "🩸", iconBg: "rgba(230,57,70,0.1)",
    symptoms: ["Frequent urination", "Excessive thirst", "Unexplained weight loss", "Blurred vision", "Fatigue", "Slow healing wounds"],
    cure: ["Monitor blood sugar levels regularly", "Follow a balanced low-sugar, high-fiber diet", "Exercise for 30+ minutes daily", "Take prescribed medications (Metformin, Insulin)", "Maintain healthy weight", "Regular checkups every 3 months (HbA1c test)"],
    prevention: "Maintain healthy weight, exercise regularly, limit sugar intake, get regular screenings"
  },
  {
    name: "Hypertension", category: "Cardiovascular", icon: "❤️", iconBg: "rgba(230,57,70,0.1)",
    symptoms: ["Often no symptoms (silent killer)", "Severe headaches", "Nosebleeds", "Shortness of breath", "Chest pain", "Vision problems"],
    cure: ["Reduce salt intake to <5g per day", "Exercise regularly (150 min/week)", "Maintain healthy weight (BMI 18.5-24.9)", "Take prescribed BP medications daily", "Limit alcohol and quit smoking", "Monitor BP at home and log readings"],
    prevention: "Low sodium diet, regular exercise, stress management, limit alcohol, maintain healthy weight"
  },
  {
    name: "Common Cold & Flu", category: "Respiratory Infection", icon: "🤧", iconBg: "rgba(0,180,216,0.1)",
    symptoms: ["Runny/stuffy nose", "Sore throat", "Cough", "Body aches", "Mild fever", "Sneezing"],
    cure: ["Rest and sleep 8-10 hours daily", "Drink warm fluids — honey lemon water, soups", "Gargle with warm salt water", "Take Paracetamol for fever and pain", "Use steam inhalation for congestion", "Usually resolves in 7-10 days"],
    prevention: "Wash hands frequently, avoid touching face, get flu vaccine, maintain strong immunity"
  },
  {
    name: "Asthma", category: "Respiratory", icon: "🫁", iconBg: "rgba(123,47,247,0.1)",
    symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Coughing (especially at night)", "Difficulty breathing during exercise"],
    cure: ["Use prescribed inhaler (reliever for attacks)", "Take preventer medication daily", "Identify and avoid triggers", "Keep rescue inhaler accessible", "Follow asthma action plan", "Regular checkups with pulmonologist"],
    prevention: "Avoid allergens, don't smoke, use air purifiers, exercise with proper warm-up"
  },
  {
    name: "Migraine", category: "Neurological", icon: "🧠", iconBg: "rgba(247,127,0,0.1)",
    symptoms: ["Severe throbbing headache (usually one side)", "Nausea and vomiting", "Sensitivity to light and sound", "Visual disturbances (aura)", "Dizziness"],
    cure: ["Rest in a quiet, dark room", "Apply cold compress to forehead", "Take pain relief at onset", "Stay hydrated", "Try relaxation techniques", "Consult neurologist for frequent migraines"],
    prevention: "Regular sleep schedule, manage stress, stay hydrated, identify food triggers, regular exercise"
  },
  {
    name: "Gastritis", category: "Digestive", icon: "🫃", iconBg: "rgba(45,198,83,0.1)",
    symptoms: ["Upper abdominal pain/burning", "Nausea and vomiting", "Bloating", "Loss of appetite", "Indigestion", "Dark stools"],
    cure: ["Avoid spicy, acidic, and fried foods", "Eat smaller, frequent meals", "Take antacids or PPIs as prescribed", "Avoid NSAIDs", "Test and treat H. pylori infection", "Reduce stress through yoga"],
    prevention: "Eat balanced diet, limit spicy foods, avoid smoking and alcohol, manage stress"
  }
];

export const SEED_DIETS = [
  {
    name: "Balanced Indian Diet", desc: "A wholesome vegetarian diet rich in nutrients.", emoji: "🥗",
    gradient: "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
    meals: { breakfast: "Oats Upma + Green Tea", lunch: "Dal, Rice, Sabzi, Roti, Salad", snack: "Fruits + Buttermilk", dinner: "Khichdi + Curd + Vegetables" },
    calories: "1800-2000 kcal"
  },
  {
    name: "Weight Loss Diet", desc: "Low-carb, high-protein diet for sustainable weight loss.", emoji: "🏋️",
    gradient: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
    meals: { breakfast: "Egg White Omelette + Toast", lunch: "Grilled Chicken Salad + Quinoa", snack: "Greek Yogurt + Almonds", dinner: "Fish + Steamed Vegetables" },
    calories: "1400-1600 kcal"
  },
  {
    name: "Diabetic-Friendly Diet", desc: "Low glycemic index meals to manage blood sugar.", emoji: "🩸",
    gradient: "linear-gradient(135deg, #FFEBEE, #FFCDD2)",
    meals: { breakfast: "Multigrain Roti + Paneer", lunch: "Brown Rice + Dal + Vegetables", snack: "Nuts + Apple Slices", dinner: "Grilled Fish + Salad" },
    calories: "1600-1800 kcal"
  },
  {
    name: "Heart-Healthy Diet", desc: "Rich in omega-3, fiber, and antioxidants.", emoji: "❤️",
    gradient: "linear-gradient(135deg, #E3F2FD, #BBDEFB)",
    meals: { breakfast: "Oatmeal + Berries + Flaxseeds", lunch: "Salmon + Sweet Potato + Greens", snack: "Walnuts + Dark Chocolate", dinner: "Lentil Soup + Whole Wheat Bread" },
    calories: "1800-2200 kcal"
  },
  {
    name: "Muscle Gain Diet", desc: "High-protein meal plan for bodybuilding.", emoji: "💪",
    gradient: "linear-gradient(135deg, #F3E5F5, #E1BEE7)",
    meals: { breakfast: "6 Egg Whites + Banana Shake", lunch: "Chicken Breast + Brown Rice + Broccoli", snack: "Protein Bar + Peanut Butter Toast", dinner: "Paneer Tikka + Chapati + Dal" },
    calories: "2800-3200 kcal"
  }
];

export const SEED_EXERCISES = [
  { name: "Push-ups", category: "chest", emoji: "🫷", sets: "3 × 15 reps", difficulty: "easy", bg: "rgba(0,180,216,0.1)" },
  { name: "Bench Press", category: "chest", emoji: "🏋️", sets: "4 × 10 reps", difficulty: "hard", bg: "rgba(230,57,70,0.1)" },
  { name: "Chest Fly", category: "chest", emoji: "🦅", sets: "3 × 12 reps", difficulty: "medium", bg: "rgba(247,127,0,0.1)" },
  { name: "Bicep Curls", category: "arms", emoji: "💪", sets: "3 × 12 reps", difficulty: "easy", bg: "rgba(45,198,83,0.1)" },
  { name: "Tricep Dips", category: "arms", emoji: "🤸", sets: "3 × 15 reps", difficulty: "medium", bg: "rgba(123,47,247,0.1)" },
  { name: "Hammer Curls", category: "arms", emoji: "🔨", sets: "3 × 10 reps", difficulty: "easy", bg: "rgba(0,180,216,0.1)" },
  { name: "Squats", category: "legs", emoji: "🦵", sets: "4 × 15 reps", difficulty: "medium", bg: "rgba(247,127,0,0.1)" },
  { name: "Lunges", category: "legs", emoji: "🚶", sets: "3 × 12 each leg", difficulty: "easy", bg: "rgba(45,198,83,0.1)" },
  { name: "Leg Press", category: "legs", emoji: "🦿", sets: "4 × 10 reps", difficulty: "hard", bg: "rgba(230,57,70,0.1)" },
  { name: "Plank", category: "core", emoji: "🧘", sets: "3 × 60 seconds", difficulty: "medium", bg: "rgba(0,180,216,0.1)" },
  { name: "Crunches", category: "core", emoji: "🔥", sets: "3 × 20 reps", difficulty: "easy", bg: "rgba(45,198,83,0.1)" },
  { name: "Russian Twist", category: "core", emoji: "🌀", sets: "3 × 15 each side", difficulty: "medium", bg: "rgba(123,47,247,0.1)" },
  { name: "Pull-ups", category: "back", emoji: "🧗", sets: "3 × 8 reps", difficulty: "hard", bg: "rgba(230,57,70,0.1)" },
  { name: "Lat Pulldown", category: "back", emoji: "⬇️", sets: "3 × 12 reps", difficulty: "medium", bg: "rgba(247,127,0,0.1)" },
  { name: "Deadlift", category: "back", emoji: "🏋️", sets: "4 × 8 reps", difficulty: "hard", bg: "rgba(230,57,70,0.1)" }
];

export const SEED_YOGA = [
  { name: "Surya Namaskar", subtitle: "Sun Salutation", emoji: "☀️", difficulty: "medium", duration: "5 min", bg: "rgba(247,127,0,0.1)" },
  { name: "Tadasana", subtitle: "Mountain Pose", emoji: "🏔️", difficulty: "easy", duration: "2 min", bg: "rgba(45,198,83,0.1)" },
  { name: "Vrikshasana", subtitle: "Tree Pose", emoji: "🌳", difficulty: "easy", duration: "3 min", bg: "rgba(45,198,83,0.1)" },
  { name: "Bhujangasana", subtitle: "Cobra Pose", emoji: "🐍", difficulty: "medium", duration: "3 min", bg: "rgba(0,180,216,0.1)" },
  { name: "Padmasana", subtitle: "Lotus Pose", emoji: "🪷", difficulty: "medium", duration: "5 min", bg: "rgba(123,47,247,0.1)" },
  { name: "Shavasana", subtitle: "Corpse Pose", emoji: "😌", difficulty: "easy", duration: "10 min", bg: "rgba(0,180,216,0.1)" },
  { name: "Setu Bandhasana", subtitle: "Bridge Pose", emoji: "🌉", difficulty: "medium", duration: "3 min", bg: "rgba(247,127,0,0.1)" },
  { name: "Dhanurasana", subtitle: "Bow Pose", emoji: "🏹", difficulty: "hard", duration: "3 min", bg: "rgba(230,57,70,0.1)" }
];

export const SEED_QA = [
  { question: "How much water should I drink daily?", answer: "Adults should aim for 8-10 glasses (2-3 liters) of water daily. This varies based on body weight, activity level, and climate. A good rule: drink half your body weight in ounces. If you exercise heavily or live in hot climates, increase intake. Monitor urine color — pale yellow means well-hydrated.", category: "General" },
  { question: "What is the ideal blood pressure range?", answer: "Normal blood pressure is below 120/80 mmHg. Elevated: 120-129/<80. Stage 1 Hypertension: 130-139/80-89. Stage 2: ≥140/≥90. A hypertensive crisis is >180/>120. Check BP regularly and consult a doctor if consistently elevated.", category: "Heart Health" },
  { question: "How many hours of sleep do adults need?", answer: "Adults (18-64) need 7-9 hours of quality sleep per night. Older adults (65+) need 7-8 hours. Consistent sleep schedule, dark cool room, no screens 1 hour before bed, and avoiding caffeine after 2 PM can improve sleep quality.", category: "General" },
  { question: "What are the best foods for immunity?", answer: "Top immunity-boosting foods include: citrus fruits (Vitamin C), ginger, garlic, turmeric, yogurt (probiotics), almonds (Vitamin E), spinach, green tea, papaya, and kiwi. Also ensure adequate Vitamin D (sunlight), zinc (nuts/seeds), and stay hydrated.", category: "Nutrition" },
  { question: "When should I see a doctor for a headache?", answer: "See a doctor immediately if: headache is sudden and severe ('thunderclap'), accompanied by fever/stiff neck, follows a head injury, gets progressively worse, causes confusion/vision changes, or you experience headaches more than 15 days/month.", category: "Symptoms" },
  { question: "How to manage stress naturally?", answer: "Natural stress management: 1) Deep breathing exercises (4-7-8 technique), 2) Regular exercise (30 min/day), 3) Meditation and mindfulness, 4) Adequate sleep, 5) Social connections, 6) Limit caffeine and alcohol, 7) Practice gratitude journaling, 8) Spend time in nature.", category: "Mental Health" },
  { question: "What is a healthy BMI range?", answer: "Healthy BMI is 18.5-24.9. Underweight: <18.5. Overweight: 25-29.9. Obese: ≥30. However, BMI doesn't account for muscle mass or body composition. Athletes may have high BMI but low body fat. Waist circumference is also an important health indicator.", category: "General" }
];

export const SEED_SETTINGS = {
  featureToggles: {
    medicine: true,
    aiGuide: true,
    reportTranslator: true,
    scanSearch: true,
    diseases: true,
    diets: true,
    exercises: true,
    yoga: true,
    healthRecords: true,
    storage: true,
    qa: true,
    healthStatus: true,
  },
  bannerTitle: 'Get the Best Medical Services',
  bannerText: 'We provide best quality medical services for you and your family.',
  bannerEmoji: '👨‍⚕️',
};
