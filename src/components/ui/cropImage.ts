export default function getCroppedImg(imageSrc: any, pixelCrop: any) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Failed to get canvas context"));

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
