import { ZipFile } from "./types";

export const decoupleFileName = (fileName: string | undefined): ZipFile => {
  if (!fileName) return { name: fileName || "", ext: "" };
  const arr = fileName.split(".");
  const ext = arr[arr.length - 1];
  const name = arr.filter((t) => t !== ext).join(".");
  return {
    name: name,
    ext: ext || "",
  };
};
