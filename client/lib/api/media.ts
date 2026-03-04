// Media Upload API Service

export interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface UploadResponse {
  ok: boolean;
  file?: UploadedFile;
  error?: string;
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/media/upload/image", {
      method: "POST",
      body: formData,
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      const text = await response.text();
      console.error(
        "Failed to parse image upload response:",
        response.status,
        text.substring(0, 500),
      );
      return {
        ok: false,
        error: `সার্ভার ত্রুটি: অবৈধ প্রতিক্রিয়া`,
      };
    }

    if (!response.ok) {
      console.error("Upload image response error:", response.status, data);
      return { ok: false, error: data.error || `আপলোড ব্যর্থ: ${response.status}` };
    }

    return data;
  } catch (error) {
    console.error("Upload image error:", error);
    const errorMsg = error instanceof Error ? error.message : "নেটওয়ার্ক সংযোগ ত্রুটি";
    return { ok: false, error: errorMsg };
  }
}

export async function uploadAudio(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/media/upload/audio", {
      method: "POST",
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Upload audio error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function uploadVideo(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/media/upload/video", {
      method: "POST",
      body: formData,
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      const text = await response.text();
      console.error(
        "Failed to parse video upload response:",
        response.status,
        text.substring(0, 500),
      );
      return {
        ok: false,
        error: `সার্ভার ত্রুটি: অবৈধ প্রতিক্রিয়া`,
      };
    }

    if (!response.ok) {
      console.error("Upload video response error:", response.status, data);
      return { ok: false, error: data.error || `ভিডিও আপলোড ব্যর্থ: ${response.status}` };
    }

    return data;
  } catch (error) {
    console.error("Upload video error:", error);
    const errorMsg = error instanceof Error ? error.message : "নেটওয়ার্ক সংযোগ ত্রুটি";
    return { ok: false, error: errorMsg };
  }
}

export async function uploadUserPhoto(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/media/upload/photo", {
      method: "POST",
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Upload photo error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function uploadFile(file: File, folderType?: string): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (folderType) {
      formData.append("folderType", folderType);
    }

    const response = await fetch("/api/media/upload/file", {
      method: "POST",
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Upload file error:", error);
    return { ok: false, error: "Network error" };
  }
}
