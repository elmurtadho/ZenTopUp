/**
 * Client-side smart image compression utility using HTML5 Canvas.
 * Resizes and compresses image files directly in the browser to lightweight WebP/JPEG Data URLs.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

export interface CompressResult {
  dataUrl: string;
  sizeKb: number;
  width: number;
  height: number;
  originalSizeKb: number;
}

export function compressImageFile(
  file: File,
  options: CompressOptions = {}
): Promise<CompressResult> {
  const {
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.82,
    format = 'image/webp',
  } = options;

  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File yang dipilih bukan gambar yang valid.'));
    }

    const originalSizeKb = Math.round(file.size / 1024);

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format file gambar tidak didukung atau rusak.'));
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect ratio scale
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight ? (height = maxHeight) : (height = Math.round((height * maxWidth) / width));
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Gagal membuat canvas 2D untuk kompresi.'));
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try preferred format first (WebP preferred)
        let dataUrl = canvas.toDataURL(format, quality);

        // Calculate size in KB
        let base64String = dataUrl.startsWith('data:') ? dataUrl.split(',')[1] || '' : dataUrl;
        let sizeKb = Math.round((base64String.length * 3) / 4 / 1024);

        // If WebP is not supported by older browser (fallback is usually PNG which can be large), fallback to JPEG
        if (dataUrl.startsWith('data:image/png') && format !== 'image/png') {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          base64String = dataUrl.split(',')[1] || '';
          sizeKb = Math.round((base64String.length * 3) / 4 / 1024);
        }

        resolve({
          dataUrl,
          sizeKb,
          width,
          height,
          originalSizeKb,
        });
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
