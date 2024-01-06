"use client";
import Select from "@/app/components/inputs/Select";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { User } from "@prisma/client";
import axios from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface GroupChatModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  users: User[];
}

export default function GroupChatModal({
  setIsOpen,
  users,
}: GroupChatModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/conversations", { ...data, isGroup: true })
      .then(() => {
        router.refresh();
        setIsOpen(false);
        toast.success("Group Created Successfully");
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };
  return (
    <div className="fixed top-0 left-0 bg-black/50 w-full h-screen overflow-auto z-[40] flex items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full bg-white dark:bg-main flex flex-col gap-y-2 mx-auto my-8 p-5 rounded-md"
      >
        <div className="flex justify-between items-center border-b border-gray-200 py-3">
          <h5 className="m-0">Create Post</h5>
          <span
            className="cursor-pointer text-3xl font-black"
            onClick={() => setIsOpen(false)}
          >
            <X className="hover:bg-slate-100 p-1 w-10 h-10 rounded-lg transition" />
          </span>
        </div>

        <div className="mb-3">
          <div className="my-3">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
          </div>
          <div className="">
            <Select
              disabled={isLoading}
              label="Members"
              options={users.map((user) => ({
                value: user.id,
                label: user.name,
              }))}
              onChange={(value) =>
                setValue("members", value, { shouldValidate: true })
              }
              value={members}
            />
          </div>
        </div>

        <Button type="submit" isLoading={isLoading}>
          Save
        </Button>
      </form>
    </div>
  );
}
