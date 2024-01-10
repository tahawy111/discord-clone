"use client";

import { cn } from "@/lib/utils";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, Dispatch, SetStateAction, useId, useState } from "react";
import { UseFormSetValue } from "react-hook-form";

interface FileUploadProps {
  endpoint: "messageFile" | "serverImage";
  file?: File | string;
  setFile: Dispatch<SetStateAction<File | undefined | string>>;
  setValue: UseFormSetValue<{
    image: string;
  }>;
}

const FileUpload = ({ endpoint, file, setFile, setValue }: FileUploadProps) => {
  const inputId = useId();

  const handleImageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target.files![0];
    setFile(fileInput);

    if (e.target.value === undefined) {
      setValue("image", "");
    } else {
      setValue("image", "modified");
    }
  };

  const fileType = (file as File)?.type.split("/")[0];
  const fileName = (file as File)?.name;

  return (
    <div className="rounded-lg w-96">
      <input
        onChange={handleImageInputChange}
        type="file"
        className="hidden"
        id={inputId}
      />
      {!file && typeof file === "undefined" ? (
        <label
          htmlFor={inputId}
          className="w-full h-full flex justify-center items-center flex-col border-gray-900/10 border-2 py-10 rounded-lg border-dashed"
        >
          <UploadCloud size={40} className="text-gray-500" />

          <h2 className="text-blue-500 font-semibold">
            Choose files or drag and drop
          </h2>
          <p className="text-sm text-gray-600">Image (4MB)</p>
        </label>
      ) : fileType === "image" ? (
        <div
          className={cn(
            "relative h-20 w-20 mt-5 mx-auto",
            endpoint === "messageFile" && "w-32 h-32"
          )}
        >
          <Image
            className={cn(
              "rounded-full object-contain",
              endpoint === "messageFile" && "rounded-none"
            )}
            src={typeof file === "string" ? file : URL.createObjectURL(file)}
            alt="Image Server"
            fill
          />
          <button
            onClick={() => setFile(undefined)}
            className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "relative w-full p-6 rounded-lg mt-5 mx-auto bg-red-500",
          )}
        >
          <p className="text-white">{fileName}</p>
          <button
            onClick={() => setFile(undefined)}
            className="bg-white text-rose-500 p-1 rounded-full absolute top-1.5 right-1 shadow-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
