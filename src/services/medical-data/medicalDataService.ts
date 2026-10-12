import { DiseaseInfo, MedicineInfo, HospitalFacility, MedicalRecordItem } from './types.ts';

export interface MedicalDataServiceInterface {
  isDataSourceConnected(): boolean;
  getVerifiedSourcesList(): string[];
}

export class DiseaseService implements MedicalDataServiceInterface {
  public isDataSourceConnected(): boolean {
    return false; // Honest state: waiting for official API / validated database
  }

  public getVerifiedSourcesList(): string[] {
    return ['World Health Organization (WHO)', 'ICD-11 Official Registry', 'PubMed / NCBI'];
  }

  public async searchDiseases(_query: string): Promise<DiseaseInfo[]> {
    // Zero fabricated data
    return [];
  }

  public async getDiseaseById(_id: string): Promise<DiseaseInfo | null> {
    return null;
  }
}

export class MedicineService implements MedicalDataServiceInterface {
  public isDataSourceConnected(): boolean {
    return false;
  }

  public getVerifiedSourcesList(): string[] {
    return ['FDA National Drug Code Directory', 'RxNorm / U.S. National Library of Medicine'];
  }

  public async searchMedicines(_query: string): Promise<MedicineInfo[]> {
    return [];
  }
}

export class HospitalService implements MedicalDataServiceInterface {
  public isDataSourceConnected(): boolean {
    return false;
  }

  public getVerifiedSourcesList(): string[] {
    return ['OpenStreetMap Healthcare POIs', 'Verified State Health Registries'];
  }

  public async getNearbyFacilities(_lat: number, _lng: number, _radiusKm: number): Promise<HospitalFacility[]> {
    return [];
  }
}

export class MedicalRecordsService {
  private STORAGE_RECORDS_KEY = 'fitmadix_user_records_v2';

  public async getUserRecords(userId: string): Promise<MedicalRecordItem[]> {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(`${this.STORAGE_RECORDS_KEY}_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public async addRecord(userId: string, record: Omit<MedicalRecordItem, 'id' | 'createdAt' | 'userId'>): Promise<MedicalRecordItem> {
    const records = await this.getUserRecords(userId);
    const newRecord: MedicalRecordItem = {
      ...record,
      id: `rec_${Date.now()}`,
      userId,
      createdAt: new Date().toISOString(),
    };
    records.unshift(newRecord);
    localStorage.setItem(`${this.STORAGE_RECORDS_KEY}_${userId}`, JSON.stringify(records));
    return newRecord;
  }
}

export const diseaseService = new DiseaseService();
export const medicineService = new MedicineService();
export const hospitalService = new HospitalService();
export const medicalRecordsService = new MedicalRecordsService();
