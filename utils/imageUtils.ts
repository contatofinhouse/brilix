export const addWatermark = (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `data:image/png;base64,${base64Image}`;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      
      // 1. Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // 2. Style the watermark
      const watermarkText = 'AI Image Stylist';
      const fontSize = Math.max(12, Math.min(canvas.width, canvas.height) / 25);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // 3. Save state, rotate, and draw pattern
      ctx.save();
      ctx.rotate(-Math.PI / 6); // Rotate by -30 degrees

      const textMetrics = ctx.measureText(watermarkText);
      const stepX = textMetrics.width + 100;
      const stepY = fontSize * 5;

      // Loop over a grid larger than the canvas to account for rotation
      for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
        for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
          ctx.fillText(watermarkText, x, y);
        }
      }
      
      // 4. Restore the original canvas state (un-rotated)
      ctx.restore();
      
      // 5. Get the new image as a base64 string
      const watermarkedImage = canvas.toDataURL('image/png').split(',')[1];
      resolve(watermarkedImage);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for watermarking'));
    };
  });
};
