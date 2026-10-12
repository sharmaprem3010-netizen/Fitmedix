export interface MedicalEntityMetadata {
  id: string;
  source: 'WHO' | 'PubMed' | 'FDA' | 'CDC' | 'ClinicalTrials' | 'InternalVerified';
  sourceUrl?: string;
  lastVerifiedDate: string;
}

export interface DiseaseInfo extends MedicalEntityMetadata {
  icdCode?: string;
  name: string;
  category: string;
  summary: string;
  symptoms: string[];
  riskFactors: string[];
}

export interface MedicineInfo extends MedicalEntityMetadata {
  rxNormCode?: string;
  genericName: string;
  brandNames: string[];
  indications: string[];
  precautions: string[];
  contraindications: string[];
}

export interface HospitalFacility {
  id: string;
  name: string;
  type: 'general-hospital' | 'specialty-clinic' | 'emergency-center' | 'diagnostic-lab';
  address: string;
  latitude: number;
  longitude: number;
  emergencyAvailable: boolean;
  sourceProvider: 'OpenStreetMap' | 'GoogleMaps' | 'OfficialRegistry';
}

export interface MedicalRecordItem {
  id: string;
  userId: string;
  title: string;
  category: 'lab-report' | 'prescription' | 'discharge-summary' | 'imaging' | 'vaccine';
  date: string;
  issuer?: string;
  fileUrl?: string;
  verifiedStatus: 'unverified' | 'verified';
  createdAt: string;
}
