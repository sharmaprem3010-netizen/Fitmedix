import { Exercise, Routine, MealItem, VitalsData, WeightLogEntry, StrengthRecord, MacroTargets } from '../types/fitness';

export const EXERCISES_DATABASE: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Barbell Bench Press',
    category: 'Chest',
    primaryMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Lie on the bench with eyes under the bar. Pinch shoulder blades together and press feet into floor.',
      'Grip the bar slightly wider than shoulder-width with wrists straight.',
      'Unrack and lower bar smoothly to lower-mid chest level with elbows at ~45-60 degrees.',
      'Press explosively back up to top lockout position while keeping shoulder blades retracted.'
    ],
    tips: ['Keep feet firmly planted', 'Do not bounce bar off chest', 'Maintain leg drive'],
    defaultSets: 4,
    defaultReps: '8-10',
    restSeconds: 120,
  },
  {
    id: 'ex-2',
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    primaryMuscle: 'Upper Pectoralis',
    secondaryMuscles: ['Anterior Deltoids', 'Triceps'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    instructions: [
      'Set bench to 30-45 degree incline.',
      'Kick dumbbells up to shoulder level as you lie back.',
      'Press dumbbells up overhead without letting them clack together at top.',
      'Lower with control until thumbs touch chest level.'
    ],
    tips: ['Focus on upper chest contraction', 'Keep elbows under wrists'],
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 90,
  },
  {
    id: 'ex-3',
    name: 'Lat Pulldown',
    category: 'Back',
    primaryMuscle: 'Latissimus Dorsi',
    secondaryMuscles: ['Biceps', 'Rhomboids', 'Rear Delts'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    instructions: [
      'Grip wide bar slightly outside shoulder-width.',
      'Sit with thighs secured under pads, slight arch in upper back.',
      'Pull bar down smoothly towards upper chest, driving elbows down and back.',
      'Return bar under control until lats are fully stretched.'
    ],
    tips: ['Think about driving with your elbows', 'Avoid excessive swinging'],
    defaultSets: 4,
    defaultReps: '10-12',
    restSeconds: 90,
  },
  {
    id: 'ex-4',
    name: 'Barbell Bent-Over Row',
    category: 'Back',
    primaryMuscle: 'Mid-Back & Lats',
    secondaryMuscles: ['Rear Delts', 'Biceps', 'Erector Spinae'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Hinge at hips with knees slightly bent until torso is ~45 degrees to floor.',
      'Grip bar slightly wider than shoulder-width.',
      'Pull bar to lower ribcage/belly button level, squeezing shoulder blades at top.',
      'Lower under control to full arm hang.'
    ],
    tips: ['Maintain neutral spine', 'Brace core tightly throughout'],
    defaultSets: 4,
    defaultReps: '8-10',
    restSeconds: 120,
  },
  {
    id: 'ex-5',
    name: 'Barbell Back Squat',
    category: 'Legs',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes', 'Hamstrings', 'Lower Back'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    instructions: [
      'Position bar across upper traps, unrack and take two steps back.',
      'Stand with feet shoulder-width apart, toes slightly turned out.',
      'Brace core, push hips back and knees out to lower until thighs are parallel to floor or below.',
      'Drive through mid-foot to stand back up to full extension.'
    ],
    tips: ['Keep chest elevated', 'Drive knees outwards', 'Take a big breath before descent'],
    defaultSets: 4,
    defaultReps: '6-8',
    restSeconds: 180,
  },
  {
    id: 'ex-6',
    name: 'Romanian Deadlift (RDL)',
    category: 'Legs',
    primaryMuscle: 'Hamstrings',
    secondaryMuscles: ['Glutes', 'Erector Spinae', 'Grip'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Hold barbell at hip height with overhand grip, feet hip-width.',
      'Push hips straight backward while keeping knees soft (slight bend).',
      'Lower bar close along legs until a deep hamstring stretch is felt (shin height).',
      'Drive hips forward to return to standing.'
    ],
    tips: ['Movement is a hip hinge, not a squat', 'Keep bar close to legs'],
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 120,
  },
  {
    id: 'ex-7',
    name: 'Seated Overhead Dumbbell Press',
    category: 'Shoulders',
    primaryMuscle: 'Anterior & Medial Deltoids',
    secondaryMuscles: ['Triceps', 'Upper Traps'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    instructions: [
      'Set bench upright at 80-90 degrees.',
      'Hold dumbbells at ear height with palms facing forward or slightly angled.',
      'Press dumbbells overhead until arms are nearly locked out.',
      'Lower smoothly back to ear height.'
    ],
    tips: ['Brace core to prevent excessive arching', 'Keep control on descent'],
    defaultSets: 4,
    defaultReps: '8-10',
    restSeconds: 90,
  },
  {
    id: 'ex-8',
    name: 'Lateral Cable Raises',
    category: 'Shoulders',
    primaryMuscle: 'Lateral Deltoids',
    secondaryMuscles: ['Traps'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    instructions: [
      'Attach single handle to bottom pulley.',
      'Stand side-on or behind cable stack and grip handle.',
      'Raise arm out to the side until parallel with floor, lead with elbow.',
      'Control weight on the descent to keep constant cable tension.'
    ],
    tips: ['Lead with elbows', 'Avoid shrugging shoulders up'],
    defaultSets: 4,
    defaultReps: '12-15',
    restSeconds: 60,
  },
  {
    id: 'ex-9',
    name: 'Barbell Bicep Curls',
    category: 'Arms',
    primaryMuscle: 'Biceps Brachii',
    secondaryMuscles: ['Forearms'],
    equipment: 'Barbell',
    difficulty: 'Beginner',
    instructions: [
      'Stand upright holding EZ-bar or straight bar with underhand grip.',
      'Keep elbows pinned near ribs as you curl bar toward shoulders.',
      'Squeeze biceps hard at top.',
      'Lower weight slowly back to full elbow extension.'
    ],
    tips: ['Do not swing torso', 'Keep elbows stationary'],
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 60,
  },
  {
    id: 'ex-10',
    name: 'Triceps Rope Pushdowns',
    category: 'Arms',
    primaryMuscle: 'Triceps Lateral & Medial Head',
    secondaryMuscles: ['Anterior Deltoids'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    instructions: [
      'Attach rope to top cable pulley.',
      'Hold rope with neutral palms, elbows tucked into side.',
      'Extend arms downward, spreading rope handles apart at bottom extension.',
      'Return to 90 degree elbow bend smoothly.'
    ],
    tips: ['Lock upper arms in place', 'Fully extend at the bottom'],
    defaultSets: 3,
    defaultReps: '12-15',
    restSeconds: 60,
  },
  {
    id: 'ex-11',
    name: 'Hanging Leg Raises',
    category: 'Core',
    primaryMuscle: 'Rectus Abdominis',
    secondaryMuscles: ['Hip Flexors', 'Grip'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    instructions: [
      'Hang from pull-up bar with overhand grip.',
      'Brace core and lift legs up straight or bent knees to waist height or higher.',
      'Squeeze abs at top elevation.',
      'Lower legs under control without swinging back and forth.'
    ],
    tips: ['Avoid momentum', 'Tilt pelvis up at top of movement'],
    defaultSets: 3,
    defaultReps: '12-15',
    restSeconds: 60,
  },
  {
    id: 'ex-12',
    name: 'Assault Bike / Rowing Intervals',
    category: 'Cardio',
    primaryMuscle: 'Cardiovascular System',
    secondaryMuscles: ['Full Body'],
    equipment: 'Machine',
    difficulty: 'Intermediate',
    instructions: [
      'Perform 30 seconds max effort sprint followed by 30 seconds active recovery.',
      'Maintain strong posture and breathing rhythm.'
    ],
    tips: ['Pace explosive bursts', 'Focus on breathing control'],
    defaultSets: 8,
    defaultReps: '30s / 30s',
    restSeconds: 30,
  }
];

export const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'routine-pull-a',
    title: 'Hypertrophy: Pull A',
    subtitle: 'Back & Biceps Focus',
    category: 'Hypertrophy Split',
    durationMinutes: 60,
    targetMuscles: ['Back', 'Biceps', 'Rear Delts'],
    difficulty: 'Intermediate',
    exercises: [
      { exerciseId: 'ex-3', exerciseName: 'Lat Pulldown', category: 'Back', sets: 4, reps: '10-12', targetWeightKg: 65, restSeconds: 90 },
      { exerciseId: 'ex-4', exerciseName: 'Barbell Bent-Over Row', category: 'Back', sets: 4, reps: '8-10', targetWeightKg: 70, restSeconds: 120 },
      { exerciseId: 'ex-9', exerciseName: 'Barbell Bicep Curls', category: 'Arms', sets: 3, reps: '10-12', targetWeightKg: 32.5, restSeconds: 60 },
      { exerciseId: 'ex-8', exerciseName: 'Lateral Cable Raises', category: 'Shoulders', sets: 3, reps: '12-15', targetWeightKg: 12.5, restSeconds: 60 }
    ]
  },
  {
    id: 'routine-push-a',
    title: 'Hypertrophy: Push A',
    subtitle: 'Chest, Shoulders & Triceps',
    category: 'Hypertrophy Split',
    durationMinutes: 65,
    targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
    difficulty: 'Intermediate',
    exercises: [
      { exerciseId: 'ex-1', exerciseName: 'Barbell Bench Press', category: 'Chest', sets: 4, reps: '8-10', targetWeightKg: 85, restSeconds: 120 },
      { exerciseId: 'ex-2', exerciseName: 'Incline Dumbbell Press', category: 'Chest', sets: 3, reps: '10-12', targetWeightKg: 30, restSeconds: 90 },
      { exerciseId: 'ex-7', exerciseName: 'Seated Overhead Dumbbell Press', category: 'Shoulders', sets: 4, reps: '8-10', targetWeightKg: 24, restSeconds: 90 },
      { exerciseId: 'ex-10', exerciseName: 'Triceps Rope Pushdowns', category: 'Arms', sets: 3, reps: '12-15', targetWeightKg: 27.5, restSeconds: 60 }
    ]
  },
  {
    id: 'routine-legs-a',
    title: 'Lower Body Strength',
    subtitle: 'Quads, Hamstrings & Glutes',
    category: 'Leg Day',
    durationMinutes: 70,
    targetMuscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
    difficulty: 'Advanced',
    exercises: [
      { exerciseId: 'ex-5', exerciseName: 'Barbell Back Squat', category: 'Legs', sets: 4, reps: '6-8', targetWeightKg: 110, restSeconds: 180 },
      { exerciseId: 'ex-6', exerciseName: 'Romanian Deadlift (RDL)', category: 'Legs', sets: 4, reps: '10-12', targetWeightKg: 90, restSeconds: 120 },
      { exerciseId: 'ex-11', exerciseName: 'Hanging Leg Raises', category: 'Core', sets: 3, reps: '12-15', restSeconds: 60 }
    ]
  },
  {
    id: 'routine-hiit-core',
    title: 'HIIT Conditioning & Core',
    subtitle: 'High Output Fat Burn',
    category: 'Conditioning',
    durationMinutes: 40,
    targetMuscles: ['Cardio', 'Core', 'Full Body'],
    difficulty: 'Intermediate',
    exercises: [
      { exerciseId: 'ex-12', exerciseName: 'Assault Bike / Rowing Intervals', category: 'Cardio', sets: 8, reps: '30s / 30s', restSeconds: 30 },
      { exerciseId: 'ex-11', exerciseName: 'Hanging Leg Raises', category: 'Core', sets: 4, reps: '15', restSeconds: 45 }
    ]
  }
];

export const INITIAL_VITALS: VitalsData = {
  heartRateRecoveryBpm: 120,
  restingHeartRateBpm: 60,
  activeStreakDays: 0,
  weeklyOutputKwh: 0,
  totalWeeklyVolumeKg: 0,
  sleepScore: 85,
  recoveryScore: 90,
  strainScore: 0,
  deviceName: 'FitMadix Pro',
  lastSynced: 'Just now'
};

export const INITIAL_MACRO_TARGETS: MacroTargets = {
  calories: 2400,
  protein: 185,
  carbs: 250,
  fat: 65,
  waterMl: 3200
};

export const SAMPLE_MEALS: MealItem[] = [];

export const SAMPLE_WEIGHT_HISTORY: WeightLogEntry[] = [];

export const SAMPLE_STRENGTH_RECORDS: StrengthRecord[] = [];
