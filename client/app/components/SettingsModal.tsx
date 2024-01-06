"use client";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { User } from "@prisma/client";
import { X } from "lucide-react";

interface SettingsModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currentUser: User;
}

export default function SettingsModal({
  setIsOpen,
  currentUser,
}: SettingsModalProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  const image = watch("image");

  const handleUpload = (result: any) => {
    setValue("image", result.info.secure_url, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    axios
      .post("/api/settings", data)
      .then(() => {
        router.refresh();
        setIsOpen(false)
        toast.success("Settings Updated")
      })
      .catch(() => toast.error("Something went wrong!"))
  };

  return (
    <div className="fixed top-0 left-0 bg-black/50 w-full h-screen overflow-auto z-[41] flex items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full bg-white dark:bg-main flex flex-col gap-y-2 mx-auto my-8 p-5 rounded-md"
      >
        <div className="flex justify-between items-center border-b border-gray-200 mb-2 py-3">
          <h5 className="m-0">Create Post</h5>
          <span
            className="cursor-pointer text-3xl font-black"
            onClick={() => setIsOpen(false)}
          >
            <X className="hover:bg-slate-100 p-1 w-10 h-10 rounded-lg transition" />
          </span>
        </div>

        <div className="my-3">
          <div className="my-3">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
          </div>
          <div className="">
            <div className="">
              <Label className="cursor-pointer">Photo</Label>
              <Input id="photo" type="file" className="hidden" />
            </div>
            <div className="flex items-center gap-x-5">
              <div
                className="relative
                           inline-block 
                           rounded-full 
                           overflow-hidden
                           h-9 
                           w-9 
                           md:h-11 
                           md:w-11
                           translate-y-1
                           mx-1
                           "
              >
                <Image
                  fill
                  className="object-cover"
                  src={
                    image ||
                    currentUser?.image ||
                    "/images/placeholder-image.jpg"
                  }
                  alt="Avatar"
                />
              </div>
              <CldUploadButton
                options={{
                  maxFiles: 1,
                }}
                onUpload={handleUpload}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              >
                Change
              </CldUploadButton>
              {/* <Label htmlFor="photo" className="cursor-pointer">
                    </Label> */}
            </div>
          </div>
        </div>

        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
