import apiPrivate from "./apiPrivate";

/**
 * Defines the structure for a file associated with a capsule.
 * These details are used by the backend to store file metadata.
 */
interface FileMetadata {
  s3_key: string;       // Unique identifier in S3
  original_name: string; // User-facing file name
  file_size: number;    // Size in bytes
  mime_type: string;     // Type of file (e.g., image/png)
}

interface CapsuleType {
  title: string;
  message: string;
  unlockDate: Date;
  files: FileMetadata[]; // Changed from string[] to FileMetadata[] for consistency
  recipients: string[];
}

export const getCapsules = async () => {
  const res = await apiPrivate.get("/capsule");

  return res.data.result;
};

export const getCapsuleDetaile = async (id: string | undefined) => {
  const res = await apiPrivate.get(`/capsule/${id}`);

  return res.data.result;
};

export const createCapspule = async ({
  title,
  message,
  unlockDate,
  files,
  recipients,
}: CapsuleType) => {
  const res = await apiPrivate.post("/capsule", {
    title,
    message,
    unlockDate,
    files,
    recipients,
  });

  return res.data.result;
};

export const deleteCapsule = async (capsuleId: string) => {
  const res = await apiPrivate.delete(`/capsule/${capsuleId}`);
  return res.data.result;
};
