export interface StorageUploadOptions {
  bucket: 'medical-reports' | 'prescriptions' | 'profile-avatars';
  userId: string;
  isEncrypted: boolean;
}

export interface StorageUploadResult {
  fileId: string;
  path: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
}

export interface StorageServiceInterface {
  isConfigured(): boolean;
  uploadFile(file: File, options: StorageUploadOptions): Promise<StorageUploadResult>;
  deleteFile(path: string): Promise<boolean>;
  getDownloadUrl(path: string): Promise<string>;
}
