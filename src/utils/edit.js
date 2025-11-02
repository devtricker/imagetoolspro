/**
 * Rotate image
 */
export const rotateImage = async (file, degrees) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate new dimensions after rotation
        const radians = (degrees * Math.PI) / 180;
        const sin = Math.abs(Math.sin(radians));
        const cos = Math.abs(Math.cos(radians));
        canvas.width = img.width * cos + img.height * sin;
        canvas.height = img.width * sin + img.height * cos;

        // Rotate and draw
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(radians);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const rotatedFile = new File([blob], file.name, { type: file.type });
              resolve(rotatedFile);
            } else {
              reject(new Error('Rotation failed'));
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
 * Flip image
 */
export const flipImage = async (file, direction = 'horizontal') => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (direction === 'horizontal') {
          ctx.scale(-1, 1);
          ctx.drawImage(img, -img.width, 0);
        } else {
          ctx.scale(1, -1);
          ctx.drawImage(img, 0, -img.height);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const flippedFile = new File([blob], file.name, { type: file.type });
              resolve(flippedFile);
            } else {
              reject(new Error('Flip failed'));
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
 * Adjust image brightness, contrast, saturation
 */
export const adjustImage = async (file, adjustments) => {
  const { brightness = 100, contrast = 100, saturation = 100 } = adjustments;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Apply filters
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const adjustedFile = new File([blob], file.name, { type: file.type });
              resolve(adjustedFile);
            } else {
              reject(new Error('Adjustment failed'));
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
 * Apply filter to image
 */
export const applyFilter = async (file, filterName) => {
  const filters = {
    grayscale: 'grayscale(100%)',
    sepia: 'sepia(100%)',
    blur: 'blur(5px)',
    invert: 'invert(100%)',
    'hue-rotate': 'hue-rotate(90deg)',
    vintage: 'sepia(50%) contrast(120%) brightness(90%)',
    cold: 'hue-rotate(180deg) saturate(150%)',
    warm: 'sepia(30%) saturate(130%)',
  };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        ctx.filter = filters[filterName] || 'none';
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const filteredFile = new File([blob], file.name, { type: file.type });
              resolve(filteredFile);
            } else {
              reject(new Error('Filter application failed'));
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
 * Add text watermark to image
 */
export const addTextWatermark = async (file, text, options = {}) => {
  const {
    fontSize = 48,
    color = 'rgba(255, 255, 255, 0.5)',
    position = 'bottom-right',
    fontFamily = 'Arial',
  } = options;

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

        // Set text properties
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textBaseline = 'bottom';

        // Calculate position
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const padding = 20;

        let x, y;
        switch (position) {
          case 'top-left':
            x = padding;
            y = fontSize + padding;
            break;
          case 'top-right':
            x = canvas.width - textWidth - padding;
            y = fontSize + padding;
            break;
          case 'bottom-left':
            x = padding;
            y = canvas.height - padding;
            break;
          case 'bottom-right':
          default:
            x = canvas.width - textWidth - padding;
            y = canvas.height - padding;
            break;
          case 'center':
            x = (canvas.width - textWidth) / 2;
            y = canvas.height / 2;
            break;
        }

        ctx.fillText(text, x, y);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const watermarkedFile = new File([blob], file.name, { type: file.type });
              resolve(watermarkedFile);
            } else {
              reject(new Error('Watermark failed'));
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

