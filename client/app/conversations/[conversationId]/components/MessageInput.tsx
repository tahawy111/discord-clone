"use client";
import {} from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  id: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  required: boolean;
  placeholder: string;
  type?: string;
}

export default function MessageInput({
  id,
  register,
  errors,
  required,
  placeholder,
  type,
}: MessageInputProps) {
  return (
    <div className="relative w-full">
        <input
          type={type}
          id={id}
          autoComplete={id}
          {...register(id, { required })}
          placeholder={placeholder}
          className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
        />
    </div>
  );
}
