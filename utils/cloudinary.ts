import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

// Allowed file types
type FileType = "image" | "video" | "raw";

const getResourceType = (mimeType: string): FileType => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";

  // ✅ All document formats go to "raw" to prevent corruption
  if (
    mimeType === "application/pdf" ||
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/vnd.ms-powerpoint" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return "raw";
  }

  return "raw";
};

export const uploadSingleFile = async (
  fileBuffer: Buffer,
  folderName: string,
  mimeType: string
): Promise<string> => {
  try {
    const resourceType = getResourceType(mimeType);

    const result = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: folderName,
          format: resourceType === "raw" ? undefined : undefined,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(new Error(`Upload failed: ${error.message}`));
          } else {
            resolve(result?.secure_url || "");
          }
        }
      );
      uploadStream.end(fileBuffer);
    });

    return result;
  } catch (error: any) {
    console.error("Error uploading file to Cloudinary:", error.message);
    throw new Error("Failed to upload file");
  }
};
