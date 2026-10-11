import { UserAccount, UserHealthProfile } from '../../types/index.ts';
import {
  AuthCredentials,
  SignUpPayload,
  AuthResponse,
  AuthenticationServiceInterface,
} from './types.ts';

const STORAGE_KEY_USER = 'fitmadix_auth_user_v2';
const STORAGE_KEY_PROFILE = 'fitmadix_auth_profile_v2';

/**
 * FitMadix Authentication Service (Supabase-Ready)
 *
 * Integration Note:
 * When connecting live Supabase credentials, swap the internal storage calls
 * with `supabase.auth.signUp`, `supabase.auth.signInWithPassword`, and `supabase.from('profiles')`.
 */
export class SupabaseReadyAuthService implements AuthenticationServiceInterface {
  private listeners: Set<(user: UserAccount | null) => void> = new Set();
  private currentUser: UserAccount | null = null;
  private currentProfile: UserHealthProfile | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const rawUser = localStorage.getItem(STORAGE_KEY_USER);
      const rawProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (rawUser) {
        this.currentUser = JSON.parse(rawUser);
      }
      if (rawProfile) {
        this.currentProfile = JSON.parse(rawProfile);
      }
    } catch {
      // Storage unavailable or corrupted
      this.currentUser = null;
      this.currentProfile = null;
    }
  }

  public async initialize(): Promise<AuthResponse> {
    this.loadFromStorage();
    return {
      user: this.currentUser,
      profile: this.currentProfile,
    };
  }

  public async signUp(payload: SignUpPayload): Promise<AuthResponse> {
    if (!payload.email || !payload.password || !payload.fullName) {
      return { user: null, profile: null, error: 'Please provide name, valid email, and password.' };
    }

    if (payload.password.length < 8) {
      return { user: null, profile: null, error: 'Password must be at least 8 characters long.' };
    }

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      email: payload.email.trim().toLowerCase(),
      fullName: payload.fullName.trim(),
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
    };

    this.currentUser = newUser;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    this.notifyListeners();

    return { user: newUser, profile: this.currentProfile };
  }

  public async login(credentials: AuthCredentials): Promise<AuthResponse> {
    if (!credentials.email || !credentials.password) {
      return { user: null, profile: null, error: 'Email and password are required.' };
    }

    // In local architecture, restore or create user session with provided email
    const existingRaw = localStorage.getItem(STORAGE_KEY_USER);
    let user: UserAccount;

    if (existingRaw) {
      user = JSON.parse(existingRaw);
      user.email = credentials.email.trim().toLowerCase();
    } else {
      user = {
        id: `usr_${Date.now()}`,
        email: credentials.email.trim().toLowerCase(),
        fullName: credentials.email.split('@')[0],
        isProfileComplete: false,
        createdAt: new Date().toISOString(),
      };
    }

    this.currentUser = user;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    this.notifyListeners();

    return { user, profile: this.currentProfile };
  }

  public async logout(): Promise<void> {
    this.currentUser = null;
    this.currentProfile = null;
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    this.notifyListeners();
  }

  public async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    // Architecture hook for Supabase resetPasswordForEmail
    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${email}. Check your inbox.`,
    };
  }

  public async saveProfile(profileData: Partial<UserHealthProfile>): Promise<UserHealthProfile> {
    const existing = this.currentProfile;
    const updated: UserHealthProfile = {
      id: existing?.id || `prf_${Date.now()}`,
      userId: this.currentUser?.id || 'guest',
      fullName: profileData.fullName || existing?.fullName || this.currentUser?.fullName || '',
      dateOfBirth: profileData.dateOfBirth ?? existing?.dateOfBirth,
      age: profileData.age ?? existing?.age,
      sex: profileData.sex ?? existing?.sex ?? 'prefer-not-to-say',
      heightCm: profileData.heightCm ?? existing?.heightCm,
      weightKg: profileData.weightKg ?? existing?.weightKg,
      bloodGroup: profileData.bloodGroup ?? existing?.bloodGroup ?? 'unknown',
      knownConditions: profileData.knownConditions ?? existing?.knownConditions ?? [],
      allergies: profileData.allergies ?? existing?.allergies ?? [],
      currentMedications: profileData.currentMedications ?? existing?.currentMedications ?? [],
      previousSurgeries: profileData.previousSurgeries ?? existing?.previousSurgeries ?? [],
      healthGoals: profileData.healthGoals ?? existing?.healthGoals ?? [],
      accessibility: profileData.accessibility ?? existing?.accessibility ?? {
        language: 'en',
        voiceModeEnabled: false,
        textSize: 'standard',
        highContrast: false,
        reducedMotion: false,
        screenReaderOptimized: false,
      },
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.currentProfile = updated;
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));

    if (this.currentUser) {
      this.currentUser.isProfileComplete = true;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
      this.notifyListeners();
    }

    return updated;
  }

  public async getProfile(): Promise<UserHealthProfile | null> {
    this.loadFromStorage();
    return this.currentProfile;
  }

  public onAuthStateChange(callback: (user: UserAccount | null) => void): () => void {
    this.listeners.add(callback);
    callback(this.currentUser);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((cb) => cb(this.currentUser));
  }
}

export const authService = new SupabaseReadyAuthService();
