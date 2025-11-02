/**
 * Make image background transparent (simple color-based removal)
 */
export const makeBackgroundTransparent = async (file, tolerance = 30) => {
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

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Get corner pixel color (assumed to be background)
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];

        // Make similar colors transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
          if (diff < tolerance) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
          }
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const transparentFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.png'), {
                type: 'image/png',
              });
              resolve(transparentFile);
            } else {
              reject(new Error('Background removal failed'));
            }
          },
          'image/png',
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
 * Replace background with solid color
 */
export const replaceBackground = async (file, backgroundColor = '#ffffff', tolerance = 30) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Fill with new background color
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw original image
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Get corner pixel color (assumed to be old background)
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];

        // Parse new background color
        const hex = backgroundColor.replace('#', '');
        const newR = parseInt(hex.substr(0, 2), 16);
        const newG = parseInt(hex.substr(2, 2), 16);
        const newB = parseInt(hex.substr(4, 2), 16);

        // Replace similar colors with new background
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
          if (diff < tolerance) {
            data[i] = newR;
            data[i + 1] = newG;
            data[i + 2] = newB;
          }
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const replacedFile = new File([blob], file.name, { type: file.type });
              resolve(replacedFile);
            } else {
              reject(new Error('Background replacement failed'));
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
 * Blur background (keep center sharp)
 */
export const blurBackground = async (file, blurAmount = 10) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Draw blurred background
        ctx.filter = `blur(${blurAmount}px)`;
        ctx.drawImage(img, 0, 0);

        // Draw sharp center
        ctx.filter = 'none';
        const centerSize = 0.6; // 60% of image
        const centerX = img.width * (1 - centerSize) / 2;
        const centerY = img.height * (1 - centerSize) / 2;
        const centerW = img.width * centerSize;
        const centerH = img.height * centerSize;

        ctx.drawImage(
          img,
          centerX, centerY, centerW, centerH,
          centerX, centerY, centerW, centerH
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const blurredFile = new File([blob], file.name, { type: file.type });
              resolve(blurredFile);
            } else {
              reject(new Error('Background blur failed'));
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

