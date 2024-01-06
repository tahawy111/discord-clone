"use client";
import clsx from "clsx";
import { useId } from "react";
import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  id: string;
}

export default function Input({
  label,
  register,
  required,
  errors,
  disabled,
  id,
  ...props
}: InputProps) {
  return (
    <div className="">
      <label
        className="block text-sm font-medium leading-6 text-gray-900"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          {...register(id, { required })}
          className={clsx(
            `px-1 form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6`,
            errors[id] && "focus:ring-rose-900",
            disabled && "opacity-50 cursor-default"
          )}
          {...props}
        />
      </div>
    </div>
  );
}
