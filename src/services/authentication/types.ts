import { UserAccount, UserHealthProfile } from '../../types/index.ts';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpPayload extends AuthCredentials {
  fullName: string;
}

export interface AuthResponse {
  user: UserAccount | null;
  profile: UserHealthProfile | null;
  error?: string;
}

export interface AuthenticationServiceInterface {
  initialize(): Promise<AuthResponse>;
  signUp(payload: SignUpPayload): Promise<AuthResponse>;
  login(credentials: AuthCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  resetPassword(email: string): Promise<{ success: boolean; message: string }>;
  saveProfile(profile: Partial<UserHealthProfile>): Promise<UserHealthProfile>;
  getProfile(): Promise<UserHealthProfile | null>;
  onAuthStateChange(callback: (user: UserAccount | null) => void): () => void;
}
