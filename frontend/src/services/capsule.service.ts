import apiPrivate from "./apiPrivate";

interface CapsuleType {
  title: string;
  message: string;
  unlockDate: Date;
  files: string[];
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
