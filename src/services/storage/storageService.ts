import { StorageServiceInterface, StorageUploadOptions, StorageUploadResult } from './types.ts';

export class StorageService implements StorageServiceInterface {
  public isConfigured(): boolean {
    return false; // Ready for Supabase Storage buckets: 'medical-reports', 'prescriptions'
  }

  public async uploadFile(file: File, options: StorageUploadOptions): Promise<StorageUploadResult> {
    // Generate an authentic client-side Blob URL for user-provided file preview
    const blobUrl = URL.createObjectURL(file);
    return {
      fileId: `file_${Date.now()}`,
      path: `${options.bucket}/${options.userId}/${file.name}`,
      url: blobUrl,
      sizeBytes: file.size,
      mimeType: file.type,
    };
  }

  public async deleteFile(_path: string): Promise<boolean> {
    return true;
  }

  public async getDownloadUrl(path: string): Promise<string> {
    return path;
  }
}

export const storageService = new StorageService();
