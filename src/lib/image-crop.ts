export type CropPixels = { x: number; y: number; width: number; height: number };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Recorta a imagem na área selecionada e redimensiona para no máximo
 * `maxDimension` pixels no lado maior, comprimindo em JPEG. Isso garante que,
 * não importa o tamanho do arquivo original enviado, o resultado final fica
 * leve o suficiente para não pesar o carregamento do site.
 */
export async function getCroppedImageBlob(
  imageSrc: string,
  crop: CropPixels,
  maxDimension: number,
  quality = 0.85,
): Promise<Blob> {
  const image = await loadImage(imageSrc);

  const scale = Math.min(1, maxDimension / Math.max(crop.width, crop.height));
  const outputWidth = Math.round(crop.width * scale);
  const outputHeight = Math.round(crop.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível processar a imagem.");

  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, outputWidth, outputHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar a imagem."))),
      "image/jpeg",
      quality,
    );
  });
}
