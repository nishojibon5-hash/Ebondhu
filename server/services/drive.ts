import { google, drive_v3 } from "googleapis";
import { Readable } from "stream";

let driveInstance: drive_v3.Drive | null = null;

function getAuth() {
  const scopes = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets",
  ];

  let privateKey = process.env.GOOGLE_PRIVATE_KEY || "";
  if (privateKey.includes("\\n")) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  const credentials = {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url:
      "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  };

  const auth = google.auth.fromJSON(credentials);
  auth.scopes = scopes;
  return auth;
}

export function getDriveAPI() {
  if (!driveInstance) {
    const auth = getAuth();
    driveInstance = google.drive({ version: "v3", auth });
  }
  return driveInstance;
}

const FOLDER_ID = process.env.VITE_GOOGLE_DRIVE_FOLDER_ID || "";

// Create subfolders for organization
export const DRIVE_FOLDERS = {
  IMAGES: "Images",
  AUDIO: "Audio",
  VIDEOS: "Videos",
  DOCUMENTS: "Documents",
  USER_PHOTOS: "UserPhotos",
};

let folderMap: Record<string, string> = {};

async function ensureFolderExists(folderName: string): Promise<string> {
  if (folderMap[folderName]) {
    return folderMap[folderName];
  }

  const drive = getDriveAPI();

  try {
    // Search for existing folder
    const result = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${FOLDER_ID}' in parents and trashed=false`,
      spaces: "drive",
      fields: "files(id, name)",
      pageSize: 1,
    });

    if (result.data.files && result.data.files.length > 0) {
      const folderId = result.data.files[0].id!;
      folderMap[folderName] = folderId;
      return folderId;
    }

    // Create new folder
    const createResult = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [FOLDER_ID],
      },
      fields: "id",
    });

    const folderId = createResult.data.id!;
    folderMap[folderName] = folderId;
    return folderId;
  } catch (error) {
    console.error(`Error ensuring folder ${folderName} exists:`, error);
    throw error;
  }
}

export async function uploadFile(
  fileName: string,
  fileContent: Buffer | Readable,
  mimeType: string,
  folderType: string = DRIVE_FOLDERS.DOCUMENTS,
): Promise<string> {
  const drive = getDriveAPI();
  const folderId = await ensureFolderExists(folderType);

  try {
    const result = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType,
        parents: [folderId],
      },
      media: {
        mimeType,
        body: fileContent instanceof Buffer ? Readable.from(fileContent) : fileContent,
      },
      fields: "id, webViewLink, webContentLink",
    });

    return result.data.id || "";
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    throw error;
  }
}

export async function uploadImage(
  fileName: string,
  fileContent: Buffer,
): Promise<string> {
  return uploadFile(fileName, fileContent, "image/jpeg", DRIVE_FOLDERS.IMAGES);
}

export async function uploadAudio(
  fileName: string,
  fileContent: Buffer,
): Promise<string> {
  return uploadFile(fileName, fileContent, "audio/mpeg", DRIVE_FOLDERS.AUDIO);
}

export async function uploadVideo(
  fileName: string,
  fileContent: Buffer,
): Promise<string> {
  return uploadFile(fileName, fileContent, "video/mp4", DRIVE_FOLDERS.VIDEOS);
}

export async function uploadUserPhoto(
  fileName: string,
  fileContent: Buffer,
): Promise<string> {
  return uploadFile(
    fileName,
    fileContent,
    "image/jpeg",
    DRIVE_FOLDERS.USER_PHOTOS,
  );
}

export async function getFileDownloadUrl(fileId: string): Promise<string> {
  const drive = getDriveAPI();

  try {
    const result = await drive.files.get({
      fileId,
      fields: "webContentLink",
    });

    return result.data.webContentLink || "";
  } catch (error) {
    console.error("Error getting file download URL:", error);
    throw error;
  }
}

export async function deleteFile(fileId: string): Promise<void> {
  const drive = getDriveAPI();

  try {
    await drive.files.delete({
      fileId,
    });
  } catch (error) {
    console.error("Error deleting file from Google Drive:", error);
    throw error;
  }
}

export async function listFiles(
  folderType: string = DRIVE_FOLDERS.DOCUMENTS,
): Promise<any[]> {
  const drive = getDriveAPI();
  const folderId = await ensureFolderExists(folderType);

  try {
    const result = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      spaces: "drive",
      fields: "files(id, name, mimeType, createdTime, webViewLink)",
      pageSize: 100,
    });

    return result.data.files || [];
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
}
