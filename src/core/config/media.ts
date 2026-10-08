export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILES_PER_POST = 10;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
] as const;

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm'
] as const;

export const ALLOWED_MEDIA_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_VIDEO_TYPES
] as const;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateMediaFile(file: File): FileValidationResult {
  if (!ALLOWED_MEDIA_TYPES.includes(file.type as any)) {
    return {
      valid: false,
      error: `Formato de arquivo não suportado (${file.name}). Permitidos: imagens (JPG, PNG, WebP) ou vídeos (MP4, WebM, MOV).`
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `O arquivo ${file.name} tem ${sizeInMb}MB e excede o limite máximo permitido de ${MAX_FILE_SIZE_MB}MB.`
    };
  }

  return { valid: true };
}
