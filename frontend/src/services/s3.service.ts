import apiPrivate from "./apiPrivate";
import axios from "axios";
export const gerPreSignedUrls = async (fileNames: string[]) => {
  const res = await apiPrivate.post("/pre_signed_url", { fileNames });
  return res.data.urls;
};

/**
 * Uploads files directly to S3 using pre-signed URLs.
 * 
 * @param files - Array of File objects to upload
 * @param urls - Array of pre-signed PUT URLs from the backend
 * @returns Array of promises for the upload operations
 */
export const uploadFiles = (files: File[], urls: string[]) => {
  // We use .map to create an array of upload promises
  return urls.map((url, index) => {
    const file = files[index];
    
    // S3 pre-signed URLs for PutObject require a PUT request.
    // We also must provide the Content-Type so S3 correctly identifies the file.
    return axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  });
};
