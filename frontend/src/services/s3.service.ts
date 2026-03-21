import apiPrivate from "./apiPrivate";
import axios from "axios";
export const gerPreSignedUrls = async (fileNames: string[]) => {
  const res = await apiPrivate.post("/pre_signed_url", { fileNames });
  return res.data.urls;
};

export const uploadFiles = async (files: object[], urls: string[]) => {
  const uploadPromises = [];

  for (let i = 0; i < urls.length; i++) {
    uploadPromises[i] = axios.post(urls[i], files[i]);
  }
  return uploadPromises;
};
