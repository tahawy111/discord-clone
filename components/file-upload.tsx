"use client";

import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, Dispatch, SetStateAction, useId, useState } from "react";

interface FileUploadProps {
  endpoint: "messageFile" | "serverImage";
  file?: File;
  setFile: Dispatch<SetStateAction<File | undefined>>;
}

const FileUpload = ({ endpoint, file, setFile }: FileUploadProps) => {
  const inputId = useId();

  const handleImageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target.files![0];
    setFile(fileInput);
  };


  return (
    <div className="rounded-lg w-96">
      <input
        onChange={handleImageInputChange}
        type="file"
        className="hidden"
        id={inputId}
      />
      {!file && typeof file === "undefined" && (
        <label
          htmlFor={inputId}
          className="w-full h-full flex justify-center items-center flex-col border-gray-900/10 border py-10"
        >
          <UploadCloud size={40} className="text-gray-500" />

          <h2 className="text-blue-500 font-semibold">
            Choose files or drag and drop
          </h2>
          <p className="text-sm text-gray-600">Image (4MB)</p>
        </label>
      )}
      {file && typeof file !== "string" && (
        <div className="relative h-20 w-20 mt-5 mx-auto">
          <Image
            className="rounded-full"
            src={URL.createObjectURL(file)}
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
      )}
    </div>
  );
};

export default FileUpload;
