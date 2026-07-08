import { Area } from 'react-easy-crop';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export async function getCroppedImage(
  imageSrc: string,
  croppedAreaPixels: Area,
  outputWidth: number,
  outputHeight: number,
  mimeType = 'image/jpeg',
  quality = 0.92,
): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Unable to create image canvas.');
  }

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  context.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  return canvas.toDataURL(mimeType, quality);
}