import type { FastifyRequest } from "fastify";
import type { MultipartFile } from "@fastify/multipart";
import { Readable } from "stream";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export interface UploadOptions {
  folder?: string;
  allowedFormats?: string[];
  maxFileSize?: number; // in bytes
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
  };
}

export interface UploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

/**
 * Convert a stream to a buffer
 */
function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
  file: MultipartFile,
  cloudinary: any,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    folder = "uploads",
    allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"],
    maxFileSize = 5 * 1024 * 1024, // 5MB default
    transformation,
  } = options;

  // Validate file type
  const fileExtension = file.filename?.split(".").pop()?.toLowerCase() || "";
  if (!allowedFormats.includes(fileExtension)) {
    throw new Error(
      `Invalid file format. Allowed formats: ${allowedFormats.join(", ")}`
    );
  }

  // Read file buffer
  const buffer = await streamToBuffer(file.file);

  // Validate file size
  if (buffer.length > maxFileSize) {
    throw new Error(
      `File size exceeds maximum allowed size of ${maxFileSize / 1024 / 1024}MB`
    );
  }

  // Upload to Cloudinary
  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
      folder,
      resource_type: "image",
    };

    if (transformation) {
      uploadOptions.transformation = [
        {
          width: transformation.width,
          height: transformation.height,
          crop: transformation.crop || "limit",
          quality: transformation.quality || "auto",
        },
      ];
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary upload failed: No result returned"));
          return;
        }

        resolve({
          url: result.url,
          publicId: result.public_id,
          secureUrl: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    // Pipe buffer to upload stream
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(
  publicId: string,
  cloudinary: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error: any, result: any) => {
      if (error) {
        reject(new Error(`Cloudinary delete failed: ${error.message}`));
        return;
      }
      if (result.result !== "ok") {
        reject(new Error(`Cloudinary delete failed: ${result.result}`));
        return;
      }
      resolve();
    });
  });
}

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

