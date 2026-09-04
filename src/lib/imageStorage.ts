import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const MAX_OUTPUT_DIMENSION = 2000;
const MAX_INPUT_PIXELS = 40_000_000;

type CloudinaryUploadResponse = {
  secure_url?: unknown;
  error?: { message?: unknown };
};

async function optimizeToWebp(input: Buffer) {
  return sharp(input, { limitInputPixels: MAX_INPUT_PIXELS })
    .rotate()
    .resize({
      width: MAX_OUTPUT_DIMENSION,
      height: MAX_OUTPUT_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 84, effort: 4 })
    .toBuffer();
}

async function uploadToCloudinary(image: Buffer) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();
  if (!cloudName || !uploadPreset) return null;

  const filename = `lapitex-${randomUUID()}.webp`;
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(image)], { type: "image/webp" }), filename);
  form.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
    method: "POST",
    body: form,
    cache: "no-store",
  });
  const result = (await response.json().catch(() => ({}))) as CloudinaryUploadResponse;

  if (!response.ok || typeof result.secure_url !== "string") {
    const providerMessage = typeof result.error?.message === "string" ? result.error.message : "Provider rejected the image";
    throw new Error(`Cloud image upload failed: ${providerMessage}`);
  }

  return result.secure_url;
}

async function writeLocalImage(image: Buffer) {
  const uploadDirectory = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDirectory, { recursive: true });
  const filename = `lapitex-${randomUUID()}.webp`;
  await writeFile(join(uploadDirectory, filename), image);
  return `/uploads/${filename}`;
}

export async function storeOptimizedImage(input: Buffer) {
  const optimizedImage = await optimizeToWebp(input);
  const cloudinaryUrl = await uploadToCloudinary(optimizedImage);

  if (cloudinaryUrl) return cloudinaryUrl;

  // Local files are useful for development. Production must use durable
  // object storage because Railway application files can disappear on deploy.
  if (process.env.NODE_ENV === "production") {
    throw new Error("Image storage is not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET.");
  }

  return writeLocalImage(optimizedImage);
}
