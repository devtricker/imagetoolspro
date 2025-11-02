import exifr from 'exifr';

/**
 * Extract EXIF metadata from image
 */
export const extractMetadata = async (file) => {
  try {
    const exifData = await exifr.parse(file, { 
      tiff: true, 
      exif: true, 
      gps: true, 
      ifd0: true, 
      ifd1: true 
    });
    
    if (!exifData) {
      return { message: 'No EXIF data found' };
    }

    return exifData;
  } catch (error) {
    throw new Error('Failed to extract metadata: ' + error.message);
  }
};

/**
 * Remove EXIF metadata from image
 */
export const removeMetadata = async (file) => {
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

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const cleanFile = new File([blob], file.name, { type: file.type });
              resolve(cleanFile);
            } else {
              reject(new Error('Metadata removal failed'));
            }
          },
          file.type,
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
 * Format metadata for display
 */
export const formatMetadata = (metadata) => {
  const formatted = {};

  if (metadata.Make) formatted['Camera Make'] = metadata.Make;
  if (metadata.Model) formatted['Camera Model'] = metadata.Model;
  if (metadata.DateTime) formatted['Date Taken'] = metadata.DateTime;
  if (metadata.ExposureTime) formatted['Exposure Time'] = `${metadata.ExposureTime}s`;
  if (metadata.FNumber) formatted['F-Number'] = `f/${metadata.FNumber}`;
  if (metadata.ISO) formatted['ISO'] = metadata.ISO;
  if (metadata.FocalLength) formatted['Focal Length'] = `${metadata.FocalLength}mm`;
  if (metadata.LensModel) formatted['Lens'] = metadata.LensModel;
  if (metadata.latitude && metadata.longitude) {
    formatted['GPS'] = `${metadata.latitude.toFixed(6)}, ${metadata.longitude.toFixed(6)}`;
  }
  if (metadata.ImageWidth) formatted['Width'] = `${metadata.ImageWidth}px`;
  if (metadata.ImageHeight) formatted['Height'] = `${metadata.ImageHeight}px`;
  if (metadata.Orientation) formatted['Orientation'] = metadata.Orientation;

  return formatted;
};

/**
 * Get basic file information
 */
export const getFileInfo = (file) => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified).toLocaleString(),
  };
};

