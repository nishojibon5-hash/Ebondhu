import { RequestHandler } from "express";
import {
  uploadImage,
  uploadAudio,
  uploadVideo,
  uploadUserPhoto,
  DRIVE_FOLDERS,
  uploadFile,
} from "../services/drive";
import crypto from "crypto";

// Utility function to get file extension from MIME type
function getFileExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
    "video/mp4": "mp4",
    "video/mpeg": "mpeg",
    "video/quicktime": "mov",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
  };
  return extensions[mimeType] || "bin";
}

export const handleUploadImage: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        error: "কোনো ফাইল প্রদান করা হয়নি",
      });
    }

    const originalName = req.file.originalname || "image";
    const extension = getFileExtension(req.file.mimetype);
    const fileName = `${crypto.randomUUID()}-${Date.now()}.${extension}`;

    console.log("Uploading image:", fileName);

    let fileId: string;
    try {
      fileId = await uploadImage(fileName, req.file.buffer);
      console.log("Image uploaded successfully to Google Drive:", fileId);
    } catch (driveError) {
      console.warn("Google Drive upload failed, using fallback Base64:", driveError);
      // Fallback: use Base64 encoded data
      fileId = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    res.status(201).json({
      ok: true,
      file: {
        id: fileId,
        name: fileName,
        originalName,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Upload image error:", error);
    const errorMessage = error instanceof Error ? error.message : "ছবি আপলোড করতে ব্যর্থ";
    res.status(500).json({
      ok: false,
      error: `ছবি আপলোড ব্যর্থ: ${errorMessage}`,
    });
  }
};

export const handleUploadAudio: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        error: "No file provided",
      });
    }

    const originalName = req.file.originalname || "audio";
    const extension = getFileExtension(req.file.mimetype);
    const fileName = `${crypto.randomUUID()}-${Date.now()}.${extension}`;

    const fileId = await uploadAudio(fileName, req.file.buffer);

    res.status(201).json({
      ok: true,
      file: {
        id: fileId,
        name: fileName,
        originalName,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Upload audio error:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to upload audio",
    });
  }
};

export const handleUploadVideo: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        error: "কোনো ফাইল প্রদান করা হয়নি",
      });
    }

    const originalName = req.file.originalname || "video";
    const extension = getFileExtension(req.file.mimetype);
    const fileName = `${crypto.randomUUID()}-${Date.now()}.${extension}`;

    console.log("Uploading video:", fileName);
    const fileId = await uploadVideo(fileName, req.file.buffer);

    console.log("Video uploaded successfully:", fileId);
    res.status(201).json({
      ok: true,
      file: {
        id: fileId,
        name: fileName,
        originalName,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Upload video error:", error);
    const errorMessage = error instanceof Error ? error.message : "ভিডিও আপলোড করতে ব্যর্থ";
    res.status(500).json({
      ok: false,
      error: `ভিডিও আপলোড ব্যর্থ: ${errorMessage}`,
    });
  }
};

export const handleUploadUserPhoto: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        error: "No file provided",
      });
    }

    const originalName = req.file.originalname || "photo";
    const extension = getFileExtension(req.file.mimetype);
    const fileName = `${crypto.randomUUID()}-${Date.now()}.${extension}`;

    const fileId = await uploadUserPhoto(fileName, req.file.buffer);

    res.status(201).json({
      ok: true,
      file: {
        id: fileId,
        name: fileName,
        originalName,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Upload user photo error:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to upload photo",
    });
  }
};

export const handleUploadFile: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        error: "No file provided",
      });
    }

    const { folderType } = req.body;
    const originalName = req.file.originalname || "file";
    const extension = getFileExtension(req.file.mimetype);
    const fileName = `${crypto.randomUUID()}-${Date.now()}.${extension}`;

    const fileId = await uploadFile(
      fileName,
      req.file.buffer,
      req.file.mimetype,
      folderType || DRIVE_FOLDERS.DOCUMENTS,
    );

    res.status(201).json({
      ok: true,
      file: {
        id: fileId,
        name: fileName,
        originalName,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Upload file error:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to upload file",
    });
  }
};
