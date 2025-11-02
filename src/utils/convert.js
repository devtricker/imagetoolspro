import { jsPDF } from 'jspdf';

/**
 * Convert image to different format
 */
export const convertImage = async (file, targetFormat) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const mimeType = getMimeType(targetFormat);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File([blob], `converted.${targetFormat}`, {
                type: mimeType,
              });
              resolve(newFile);
            } else {
              reject(new Error('Conversion failed'));
            }
          },
          mimeType,
          1.0
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Convert image to PDF
 */
export const imageToPDF = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const pdf = new jsPDF({
          orientation: img.width > img.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [img.width, img.height],
        });

        pdf.addImage(e.target.result, 'JPEG', 0, 0, img.width, img.height);
        const pdfBlob = pdf.output('blob');
        const pdfFile = new File([pdfBlob], 'converted.pdf', {
          type: 'application/pdf',
        });
        resolve(pdfFile);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Convert PDF to images (first page only for simplicity)
 */
export const pdfToImage = async (file) => {
  // Note: Full PDF conversion requires pdf.js library
  // This is a placeholder for the functionality
  return new Promise((resolve, reject) => {
    reject(new Error('PDF to image conversion requires additional setup'));
  });
};

/**
 * Get MIME type from format
 */
const getMimeType = (format) => {
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    bmp: 'image/bmp',
  };
  return mimeTypes[format.toLowerCase()] || 'image/png';
};

/**
 * Get file extension from MIME type
 */
export const getExtensionFromMime = (mimeType) => {
  const extensions = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
  };
  return extensions[mimeType] || 'png';
};

