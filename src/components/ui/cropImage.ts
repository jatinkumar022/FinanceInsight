export default function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject(new Error("Failed to get canvas context"));

      // Log image and crop dimensions for debugging
      console.log("Image dimensions:", image.width, image.height);
      console.log("Crop dimensions:", pixelCrop);

      // Ensure the crop dimensions are within the image bounds
      if (
        pixelCrop.x < 0 ||
        pixelCrop.y < 0 ||
        pixelCrop.width <= 0 ||
        pixelCrop.height <= 0 ||
        pixelCrop.x + pixelCrop.width > image.width ||
        pixelCrop.y + pixelCrop.height > image.height
      ) {
        return reject(new Error("Invalid crop dimensions"));
      }

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Failed to create blob"));
          const croppedImageUrl = URL.createObjectURL(blob);
          resolve(croppedImageUrl);
        },
        "image/jpeg",
        1
      );
    };

    image.onerror = (error) => reject(error);
  });
}
